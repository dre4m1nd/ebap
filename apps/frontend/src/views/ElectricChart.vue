<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { EChartsOption } from "echarts";

import CommonChart from "@/components/CommonChart.vue";
import { getElectricChart } from "@/api/electric";
import { useDormStore } from "@/store/useDormStore";
import type { ElectricChartItem } from "@ebap/shared";

const dormStore = useDormStore();
const activeTime = ref<"24h" | "7d" | "30d">("24h");
const chartData = ref<ElectricChartItem[]>([]);

const fetchData = async () => {
  if (!dormStore.selectedDormId) {
    chartData.value = [];
    return;
  }

  const res = await getElectricChart({
    dormId: dormStore.selectedDormId,
    type: dormStore.selectedType,
    timeRange: activeTime.value,
  });
  chartData.value = res.data;
};

const labels = computed(() =>
  chartData.value.map((item) => {
    const date = new Date(item.time);
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const hour = `${date.getHours()}`.padStart(2, "0");
    return activeTime.value === "24h" ? `${month}-${day} ${hour}:00` : `${month}-${day}`;
  }),
);

const latestItem = computed(() => chartData.value[chartData.value.length - 1]);
const latestElectric = computed(() => latestItem.value?.leftElectric || "--");
const latestMoney = computed(() => latestItem.value?.leftMoney || "--");

const option = computed<EChartsOption>(() => ({
  color: ["#71c9ce", "#f7b267"],
  tooltip: {
    trigger: "axis",
  },
  legend: {
    top: 6,
    data: ["剩余电量", "剩余金额"],
  },
  grid: {
    left: 40,
    right: 40,
    top: 52,
    bottom: 26,
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: labels.value,
    axisLine: { lineStyle: { color: "#b9e8ea" } },
  },
  yAxis: [
    {
      type: "value",
      name: "电量",
      splitLine: { lineStyle: { color: "#eef9fa" } },
    },
    {
      type: "value",
      name: "金额",
      splitLine: { show: false },
    },
  ],
  series: [
    {
      name: "剩余电量",
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 8,
      areaStyle: { color: "rgba(113, 201, 206, 0.14)" },
      data: chartData.value.map((item) => Number(item.leftElectric)),
    },
    {
      name: "剩余金额",
      type: "line",
      smooth: true,
      yAxisIndex: 1,
      symbol: "circle",
      symbolSize: 8,
      data: chartData.value.map((item) => Number(item.leftMoney)),
    },
  ],
}));

watch(
  [() => dormStore.selectedDormId, () => dormStore.selectedType, activeTime],
  () => {
    void fetchData();
  },
  { immediate: true },
);
</script>

<template>
  <section class="page-shell">
    <div class="page-intro">
      <h2>概览</h2>
      <el-radio-group v-model="activeTime">
        <el-radio-button label="24h" value="24h">近 24 小时</el-radio-button>
        <el-radio-button label="7d" value="7d">近 7 天</el-radio-button>
        <el-radio-button label="30d" value="30d">近 30 天</el-radio-button>
      </el-radio-group>
    </div>

    <div class="summary-grid">
      <div class="summary-card">
        <span class="summary-label">剩余电量</span>
        <strong class="summary-value">{{ latestElectric }}</strong>
      </div>
      <div class="summary-card accent-card">
        <span class="summary-label">剩余金额</span>
        <strong class="summary-value">{{ latestMoney }}</strong>
      </div>
    </div>

    <CommonChart :option="option" height="500px" />
  </section>
</template>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.summary-card {
  padding: 16px 18px;
  border-radius: 18px;
  background: #f7ffff;
  border: 1px solid var(--line);
}

.accent-card {
  background: rgba(113, 201, 206, 0.12);
}

.summary-label {
  display: block;
  margin-bottom: 10px;
  color: var(--text-soft);
  font-size: 13px;
}

.summary-value {
  color: var(--accent-deep);
  font-size: 28px;
  line-height: 1;
}

@media (max-width: 760px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
