
export const RNDApi = () => {
  
  const api = useApi()


const NewProposal = async (_proposal:any) => {
  try {
    const response = await api('/RNDNewProposal', {
      method: 'POST',
      body:_proposal
    })

    if (response.result === 'OK') {
      return { result: true, response }
    } else {
      return { result: false, msg: response.msg_description }
    }
  } catch (e) {
    return { result: false, msg: 'خطا در ارتباط با سرور' }
  }
}

const GetInboxProposals = async () => {
  try {
    const response = await api('/RNDGetInboxProposals', {
      method: 'POST',
    })
    if (response.result === 'OK') {
      return { result: true, response }
    } else {
      return { result: false, msg: response.msg_description }
    }
  } catch (e) {
    return { result: false, msg: 'خطا در ارتباط با سرور' }
  }
  }
  
const ProposalDecision = async (_proposalId : any, _decision : any, _comment : any) => {
  try {
    const response = await api('/RNDProposalDecision', {
      method: 'POST',
      body: {
        proposalId: _proposalId,
        decision: _decision,
        comment: _comment
      }
    })
    if (response.result === 'OK') {
      return { result: true, response }
    } else {
      return { result: false, msg: response.msg_description }
    }
  } catch (e) {
    return { result: false, msg: 'خطا در ارتباط با سرور' }
  }
}
  
const FileUploader = async (_file:any) => {
  const formData=new FormData();
  formData.append('file',_file)
  try {
    const response = await api('/RNDFileUploader', {
      method: 'POST',
      body:formData
    })

 
    if (response.result === 'OK') {
      return { result: true, response }
    } else {
      return { result: false, msg: response.msg_description }
    }
  } catch (e) {
    return { result: false, msg: 'خطا در ارتباط با سرور' }
  }
}
 
const TrackingRequest = async (_request:any) => {
  try {
    const response = await api('/RNDTrackingRequest', {
      method: 'POST',
      body:_request
    })

 
    if (response.result === 'OK') {
      return { result: true, response }
    } else {
      return { result: false, msg: response.msg_description }
    }
  } catch (e) {
    return { result: false, msg: 'خطا در ارتباط با سرور' }
  }
}
 
const VerifyTrackingCode = async (_proposal:any) => {
  try {
    const response = await api('/RNDVerifyTrackingCode', {
      method: 'POST',
      body:_proposal
    })

 
    if (response.result === 'OK') {
      return { result: true, response }
    } else {
      return { result: false, msg: response.msg_description }
    }
  } catch (e) {
    return { result: false, msg: 'خطا در ارتباط با سرور' }
  }
  }

const GetCurrentProjects = async () => {
  try {
    const response = await api('/RNDCurrentProjects', {
      method: 'GET',
    })
    
    // شرط بررسی گسترش یافت: اگر response.projects از نوع آرایه بود، یعنی دیتای درستی دریافت شده است
    if (response && (response.result === 'OK' || Array.isArray(response) || Array.isArray(response.projects))) {
      return { result: true, response }
    } else {
      return { result: false, msg: response.msg_description }
    }
  } catch (e: any) {
    return { result: false, msg: e?.response?.data?.msg_description || 'خطا در ارتباط با سرور' }
  }
}

const GetMainChart = async () => {
    try {
      const response = await api('/RNDMainChart', {
        method: 'GET',
      })
      
      if (response && (response.result === 'OK' || Array.isArray(response))) {
        return { result: true, response }
      } else {
        return { result: false, msg: response.msg_description }
      }
    } catch (e: any) {
      return { result: false, msg: e?.response?.data?.msg_description || 'خطا در ارتباط با سرور' }
    }
  }

  const SendBackProposal = async (_proposalId : any , _comment : any) => {
    try {
      const response = await api('/RNDSendBackProposal', {
        method: 'POST',
        body: {
          proposalId: _proposalId, 
          comment: _comment
        }
      })
      
      if (response && (response.result === 'OK' || Array.isArray(response))) {
        return { result: true, response }
      } else {
        return { result: false, msg: response.msg_description }
      }
    } catch (e: any) {
      return { result: false, msg: e?.response?.data?.msg_description || 'خطا در ارتباط با سرور' }
    }
  }

  const ReplyAndResubmitProposal = async (_proposalId : any , _text : any , _attachments : any) => {
    try {
      const response = await api('/RNDReplyAndResubmitProposal', {
        method: 'POST',
        body: {
          proposalId: _proposalId, 
          text: _text,
          attachments: _attachments
        }
      })
      
      if (response && (response.result === 'OK' || Array.isArray(response))) {
        return { result: true, response }
      } else {
        return { result: false, msg: response.msg_description }
      }
    } catch (e: any) {
      return { result: false, msg: e?.response?.data?.msg_description || 'خطا در ارتباط با سرور' }
    }
  }
  

  return {
    NewProposal, FileUploader, TrackingRequest, VerifyTrackingCode,
    GetInboxProposals, ProposalDecision, GetCurrentProjects, GetMainChart , SendBackProposal, ReplyAndResubmitProposal
  }
}