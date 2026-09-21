<script setup lang="ts">
import { computed, ref } from 'vue';
import { RNDApi } from '~/composables/RND/RNDApi';
import Swal from 'sweetalert2';

// --- تنظیمات ECharts ---
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { TreeChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([CanvasRenderer, TreeChart, TooltipComponent]);

definePageMeta({
  layout: 'rd'
});

// فراخوانی API
const { GetMainChart } = RNDApi();

// --- تابع استخراج پیام سرور ---
function getServerMessage(res: any, fallbackMessage: string = 'خطایی رخ داده است') {
  if (!res) return fallbackMessage;
  return res.msg_description || 
         res.data?.msg_description || 
         res.response?.msg_description || 
         res.msg || 
         fallbackMessage;
}

// متغیرهای وضعیت درخواست
const apiData = ref<any>(null);
const pending = ref(true);
const error = ref<any>(null);

const fetchChartData = async () => {
  pending.value = true;
  try {
    const res = await GetMainChart();
    
    if (res && res.result === true) {
      apiData.value = res.response;
      
      const successMsg = res.response?.msg_description || res.msg;
      if (successMsg && successMsg.includes('موفق')) {
        Swal.fire({ icon: 'success', text: successMsg, timer: 1500, showConfirmButton: false });
      }
    } else {
      const errorMsg = getServerMessage(res, 'خطا در دریافت داده‌های نمودار');
      error.value = errorMsg;
      Swal.fire({ icon: 'error', text: errorMsg });
    }
  } catch (err: any) {
    const errorMsg = getServerMessage(err?.response?.data, 'خطا در ارتباط با سرور');
    error.value = errorMsg;
    Swal.fire({ icon: 'error', text: errorMsg });
  } finally {
    pending.value = false;
  }
}

// اجرای تابع واکشی داده
await fetchChartData();

// پردازش داده‌ها و تبدیل به فرمت ECharts
const chartOption = computed(() => {
  if (!apiData.value) return {};

  const headNode = apiData.value.find((item: any) => item.title === "رئیس بخش مهندسی ، برنامه ریزی و تحقیق و توسعه");
  const supervisorNode = headNode?.children?.find((child: any) => child.title === "سرپرست قسمت تحقيق و توسعه");

  const getExpertName = (title: string) => {
    if (!title) return 'نامشخص';
    if (title.includes('کنسانتره') || title.includes('گندله')) return 'علی نصرت آبادی';
    if (title.includes('احيا')) return 'عباس امیر تیموری';
    if (title.includes('فولاد')) return 'فرزاد رشید فرخی';
    if (title.includes('انرژی')) return 'رسول سلجوق شکوهی';
    return 'نامشخص';
  };

  const formattedExperts = supervisorNode?.children?.map((expert: any) => ({
    name: getExpertName(expert.title),
    position: expert.title,
    value: expert.title 
  })) || [];

  const treeData = {
    name: "علی زاهدی",
    position: "مدیر امور مهندسی، برنامه ریزی و توسعه مدیریت",
    children: [
      {
        name: "افشین فرنود مطلق",
        position: headNode ? headNode.title : "رئیس بخش مهندسی و برنامه ریزی",
        children: supervisorNode ? [
          {
            name: "کامبیز بردباری",
            position: supervisorNode.title,
            children: formattedExperts
          }
        ] : []
      }
    ]
  };

  const persianFontFamily = 'Vazirmatn, IRANSans, "IRAN Sans", Shabnam, Tahoma, sans-serif';

  return {
    textStyle: {
      fontFamily: persianFontFamily
    },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      textStyle: {
        fontFamily: persianFontFamily,
        fontSize: 13
      },
      formatter: function (info: any) {
        return `<div style="font-family: ${persianFontFamily}; text-align: right; direction: rtl;">
                  <strong>${info.data.name}</strong><br/>
                  <span style="color: #64748b; font-size: 12px;">${info.data.position}</span>
                </div>`;
      }
    },
    series: [
      {
        type: 'tree',
        data: [treeData],
        initialTreeDepth: -1, 
        top: '10%',
        left: '10%',
        bottom: '20%',
        right: '10%',
        symbolSize: 10,
        orient: 'TB',
        itemStyle: {
          color: '#3b82f6',
          borderColor: '#2563eb'
        },
        lineStyle: {
          color: '#cbd5e1',
          width: 2,
          curveness: 0.5
        },
        label: {
          position: 'bottom',
          verticalAlign: 'top',
          align: 'center',
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          borderRadius: 8,
          padding: [10, 15],
          distance: 10,
          color: '#1e293b',
          shadowColor: 'rgba(0, 0, 0, 0.05)',
          shadowBlur: 10,
          formatter: function (params: any) {
            return `{name|${params.data.name}}\n{position|${params.data.position}}`;
          },
          rich: {
            name: {
              fontFamily: persianFontFamily,
              fontSize: 16, 
              fontWeight: 'bold',
              color: '#000000', 
              align: 'center',
              padding: [0, 0, 5, 0]
            },
            position: {
              fontFamily: persianFontFamily,
              fontSize: 14, 
              fontWeight: 'bold',
              color: '#16a34a', 
              align: 'center'
            }
          }
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750
      }
    ]
  };
});
</script>


<template>
  <div dir="rtl" class="w-full bg-white dark:bg-slate-950 p-4 md:p-6 min-h-screen">
    <div class="text-center mb-6">
      <BaseHeading
        as="h1"
        size="2xl"
        weight="bold"
        class="text-black dark:text-white mb-2"
      >
        نمودار سازمانی بخش R&D شرکت فولاد سیرجان ایرانیان
      </BaseHeading>
    </div>

    <div v-if="pending" class="text-center text-gray-500 my-10 font-medium">
      در حال دریافت اطلاعات...
    </div>
    <div v-else-if="error" class="text-center text-red-500 my-10 font-medium">
      خطا در دریافت اطلاعات.
    </div>

    <ClientOnly v-else>
      <div class="w-full h-[800px] overflow-hidden bg-slate-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <v-chart class="w-full h-full" :option="chartOption" autoresize />
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
/* در صورت نیاز به استایل‌های خاص برای حالت تاریک می‌توانید اینجا اضافه کنید */
</style>