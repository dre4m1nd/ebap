<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import * as echarts from "echarts";
import type { ECharts, EChartsOption } from "echarts";

const props = withDefaults(
  defineProps<{
    option: EChartsOption;
    width?: string;
    height?: string;
  }>(),
  {
    width: "100%",
    height: "420px",
  },
);

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: ECharts | null = null;

const initChart = () => {
  if (!chartRef.value) {
    return;
  }

  chartInstance = echarts.init(chartRef.value);
  chartInstance.setOption(props.option);
};

watch(
  () => props.option,
  (nextOption) => {
    chartInstance?.setOption(nextOption, true);
  },
  { deep: true },
);

const handleResize = () => {
  chartInstance?.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  chartInstance?.dispose();
});
</script>

<template>
  <div ref="chartRef" :style="{ width, height }" />
</template>
