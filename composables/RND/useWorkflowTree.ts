import dagre from 'dagre'

export interface WorkflowHistoryItem {
  _id?: string
  posCode: string
  parentPosCode?: string | null
  referFrom?: string | null
  posTitle: string
  unit?: string | null
  level?: string
  state?: string
  decision?: string
  assignedAt?: string
  decidedAt?: string
  closedAt?: string
  comment?: string
  actorName?: string
  actorUser?: string
  actorUsers?: any[]
  attachments?: any[]
  senderReplies?: any[]
}

export interface WorkflowTreeOptions {
  proposal: any
  history: WorkflowHistoryItem[]
  formatDate: (dateString: string) => string
  baseUrl?: string
}

const NODE_WIDTH = 300
const NODE_HEIGHT = 200

function normalizeList<T = any>(value: any): T[] {
  return Array.isArray(value) ? value : []
}

// ─── نگاشت decision به برچسب فارسی برای نمایش روی edge ───
function getDecisionLabel(decision?: string): string {
  switch (decision) {
    case 'approved_by_coworker':
      return 'تایید توسط همکار'
    case 'approved':
      return 'تایید شده'
    case 'sent_back':
      return 'ارجاع به عقب'
    case 'pending':
      return 'درحال تصمیم گیری'
    case 'submitted':
    case 'resubmitted':
      return ''
    default:
      return ''
  }
}

function getDecisionColor(decision?: string, state?: string) {
  if (state === 'active' || decision === 'pending') return '#3b82f6'

  switch (decision) {
    case 'approved':
    case 'approved_by_coworker':
    case 'submitted':
    case 'resubmitted':
      return '#22c55e'
    case 'sent_back':
      return '#f59e0b'
    case 'rejected':
      return '#ef4444'
    default:
      return '#94a3b8'
  }
}

function getNodeType(item: WorkflowHistoryItem) {
  if (item.posCode === 'first_user') return 'startNode'
  return 'personNode'
}

function getLayoutedElements(nodes: any[], edges: any[], direction = 'TB') {
  const dagreGraph = new dagre.graphlib.Graph()

  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 60,
    ranksep: 110,
    marginx: 20,
    marginy: 20,
  })

  for (const node of nodes) {
    dagreGraph.setNode(node.id, {
      width: node.width || NODE_WIDTH,
      height: node.height || NODE_HEIGHT,
    })
  }

  for (const edge of edges) {
    dagreGraph.setEdge(edge.source, edge.target)
  }

  dagre.layout(dagreGraph)

  const layoutedNodes = nodes.map((node) => {
    const positioned = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: positioned.x - (node.width || NODE_WIDTH) / 2,
        y: positioned.y - (node.height || NODE_HEIGHT) / 2,
      },
      targetPosition: 'top',
      sourcePosition: 'bottom',
    }
  })

  return [...layoutedNodes, ...edges]
}

function buildEdge(source: string, target: string, color = '#3b82f6', label = '') {
  const edge: any = {
    id: `e-${source}-${target}`,
    source,
    target,
    type: 'smoothstep',
    animated: color === '#3b82f6',
    style: {
      stroke: color,
      strokeWidth: 2,
    },
  }

  if (label) {
    edge.label = label
    edge.labelStyle = {
      fill: '#334155',
      fontSize: 12,
      fontWeight: 600,
    }
    edge.labelShowBg = true
    edge.labelBgStyle = {
      fill: '#f8fafc',
      fillOpacity: 0.9,
    }
    edge.labelBgPadding = [6, 3] as [number, number]
  }

  return edge
}

function isActiveAssignmentAlreadyInHistory(
  assignment: WorkflowHistoryItem,
  history: WorkflowHistoryItem[],
) {
  return history.some((item) => {
    const sameId = item._id && assignment._id && item._id === assignment._id
    const sameAssignment =
      item.posCode === assignment.posCode &&
      item.assignedAt === assignment.assignedAt &&
      item.decision === assignment.decision
    return sameId || sameAssignment
  })
}

function getAttachmentNames(source: any): string[] {
  const list = source?.attachments || source?.attachmentFiles || source?.files || source?.documents
  return normalizeList<string>(list).filter(
    (attachment) => typeof attachment === 'string' && attachment.trim().length > 0,
  )
}

function getMatchingSenderReply(
  senderReplies: any[],
  workflowItem: WorkflowHistoryItem,
) {
  if (workflowItem.posCode !== 'first_user') return undefined
  if (workflowItem.decision !== 'resubmitted') return undefined

  const itemReplies = normalizeList(workflowItem.senderReplies)
  if (itemReplies.length > 0) {
    return itemReplies[itemReplies.length - 1]
  }

  if (!senderReplies.length) return undefined

  const targetTimes = [workflowItem.decidedAt, workflowItem.assignedAt]
    .filter((d): d is string => !!d)
    .map((d) => new Date(d).getTime())
    .filter((t) => Number.isFinite(t))

  if (targetTimes.length === 0) {
    return senderReplies[senderReplies.length - 1]
  }

  for (const targetTime of targetTimes) {
    const exactMatch = senderReplies.find((reply) => {
      const repliedAt = reply?.repliedAt ? new Date(reply.repliedAt).getTime() : Number.NaN
      return Number.isFinite(repliedAt) && repliedAt === targetTime
    })
    if (exactMatch) return exactMatch
  }

  const fallbackTime = targetTimes[0]
  let nearestReply: any
  let nearestDistance = Number.POSITIVE_INFINITY

  for (const reply of senderReplies) {
    const repliedAt = reply?.repliedAt ? new Date(reply.repliedAt).getTime() : Number.NaN
    if (!Number.isFinite(repliedAt)) continue
    const distance = Math.abs(repliedAt - fallbackTime)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestReply = reply
    }
  }

  return nearestReply || senderReplies[senderReplies.length - 1]
}

function enrichComment(item: WorkflowHistoryItem, senderReply: any) {
  if (item.posCode === 'first_user' && item.decision === 'resubmitted' && senderReply?.text) {
    return senderReply.text.trim()
  }
  return item.comment?.trim() || ''
}

function buildNodeData(
  item: WorkflowHistoryItem,
  formatDate: (dateString: string) => string,
  senderReply?: any,
  baseUrl = '',
  isFinalNode = false, 
  overallStatus?: string, // دریافت وضعیت کلی پروپوزال برای انتساب به نود
  proposalCreatedAt?: string,
) {
  const replyAttachments = senderReply ? getAttachmentNames(senderReply) : []
  const nodeAttachments = getAttachmentNames(item)

  const uniqueAttachments = Array.from(new Set([...replyAttachments, ...nodeAttachments]))
  const formattedAttachments = uniqueAttachments.map((fileName) => ({
    title: fileName,
    url: `${baseUrl}${fileName}`,
  }))

  const registrationDate = item.posCode === 'first_user' && proposalCreatedAt
    ? formatDate(proposalCreatedAt)
    : item.assignedAt ? formatDate(item.assignedAt) : '-'

  return {
    label: item.posTitle || item.posCode,
    posTitle: item.posTitle,
    posCode: item.posCode,
    actorName: item.actorName || '',
    unit: item.unit || '',
    level: item.level || '',

    // ─── تاریخ ثبت ───
    date: registrationDate,
    assignedAt: registrationDate,

    // ─── تاریخ تصمیم ───
    decidedAt: item.decidedAt ? formatDate(item.decidedAt) : '-',

    comment: enrichComment(item, senderReply),

    isActive: item.state === 'active',
    isSenderReply: item.posCode === 'first_user' && item.decision === 'resubmitted',
    isFinalNode ,
    // ─── وضعیت نهایی برای اعمال تغییر رنگ در قالب UI ───
    overallStatus: isFinalNode ? (overallStatus || '') : '',

    attachments: formattedAttachments,
    original: item,
  }
}

function buildUniqueWorkflowItems(
  history: WorkflowHistoryItem[],
  activeAssignments: WorkflowHistoryItem[],
) {
  const items = [
    ...normalizeList(history),
    ...normalizeList(activeAssignments).filter(
      (assignment) => !isActiveAssignmentAlreadyInHistory(assignment, history),
    ),
  ] as WorkflowHistoryItem[]

  const uniqueMap = new Map<string, WorkflowHistoryItem>()

  for (const item of items) {
    const id = item._id
    if (!id) continue
    uniqueMap.set(id, item)
  }

  return [...uniqueMap.values()]
}

export function buildWorkflowTree({
  proposal,
  history,
  formatDate,
  baseUrl = '',
}: WorkflowTreeOptions) {
  const nodes: any[] = []
  const edges: any[] = []

  const resolvedBaseUrl = baseUrl || proposal?.BaseUrl || ''
  const overallStatus = proposal?.overallStatus || ''

  const senderReplies = normalizeList(proposal?.senderReplies)
  const activeAssignments = normalizeList<WorkflowHistoryItem>(proposal?.activeAssignments)
  const workflowItems = buildUniqueWorkflowItems(history, activeAssignments)

  const itemMap = new Map<string, WorkflowHistoryItem>()
  for (const item of workflowItems) {
    if (item._id) itemMap.set(item._id, item)
  }

  // ✅ 1) فقط آیتم‌های تاریخچه (نه activeAssignments) معیار نهایی شدن باشند
  // چون activeAssignments معمولاً مرحله باز/در انتظار تصمیم هستند.
  const historyItems = normalizeList(history)

  // ✅ 2) پیدا کردن آخرین آیتمی که تصمیم گرفته شده (بیشترین decidedAt)
  const decidedCandidates = historyItems
    .filter(i => i?._id && i.decidedAt && i.decidedAt !== '')
    .map(i => ({ id: i._id as string, t: new Date(i.decidedAt as string).getTime() }))
    .filter(x => Number.isFinite(x.t))

  let finalNodeId: string | null = null

  if (decidedCandidates.length) {
    decidedCandidates.sort((a, b) => b.t - a.t)
    finalNodeId = decidedCandidates[0].id
  } else {
    // ✅ fallback: آخرین assignedAt در history (اگر decidedAt ندارید)
    const assignedCandidates = historyItems
      .filter(i => i?._id && i.assignedAt)
      .map(i => ({ id: i._id as string, t: new Date(i.assignedAt as string).getTime() }))
      .filter(x => Number.isFinite(x.t))

    if (assignedCandidates.length) {
      assignedCandidates.sort((a, b) => b.t - a.t)
      finalNodeId = assignedCandidates[0].id
    }
  }

  const nodeIds = new Set<string>()

  for (const item of workflowItems) {
    if (!item._id) continue

    const senderReply = getMatchingSenderReply(senderReplies, item)
    const isFinalNode = finalNodeId === item._id

    nodes.push({
      id: item._id,
      type: getNodeType(item),
      data: buildNodeData(
        item,
        formatDate,
        senderReply,
        resolvedBaseUrl,
        isFinalNode,
        overallStatus,
        proposal?.createdAt,
      ),
      position: { x: 0, y: 0 },
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    })

    nodeIds.add(item._id)
  }

  // edges مثل قبل
  for (const item of workflowItems) {
    if (!item._id) continue

    const parentId = item.referFrom
    if (parentId && nodeIds.has(parentId)) {
      const sourceItem = itemMap.get(parentId)
      const sourceDecision = sourceItem?.decision
      const sourceState = sourceItem?.state

      edges.push(buildEdge(parentId, item._id, getDecisionColor(sourceDecision, sourceState), getDecisionLabel(sourceDecision)))
    }
  }

  return getLayoutedElements(nodes, edges)
}