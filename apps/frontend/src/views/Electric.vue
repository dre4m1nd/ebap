<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";

import { pageElectricLogs } from "@/api/electric";
import { useDormStore } from "@/store/useDormStore";
import type { ElectricLog } from "@ebap/shared";

const dormStore = useDormStore();
const loading = ref(false);
const tableData = ref<ElectricLog[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const filterForm = reactive({
  dateRange: [] as string[],
});

const meterTypeText = computed(() => (dormStore.selectedType === 2 ? "空调" : "照明"));

const fetchData = async () => {
  if (!dormStore.selectedDormId) {
    tableData.value = [];
    total.value = 0;
    return;
  }

  loading.value = true;
  try {
    const res = await pageElectricLogs({
      dormId: dormStore.selectedDormId,
      type: dormStore.selectedType,
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      startTime: filterForm.dateRange[0],
      endTime: filterForm.dateRange[1],
    });
    tableData.value = res.data.records;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
};

const resetFilter = () => {
  filterForm.dateRange = [];
  currentPage.value = 1;
  void fetchData();
};

watch(
  [() => dormStore.selectedDormId, () => dormStore.selectedType],
  () => {
    currentPage.value = 1;
    void fetchData();
  },
  { immediate: true },
);
</script>

<template>
  <section class="page-shell">
    <div class="page-intro">
      <h2>电费记录</h2>
    </div>

    <div class="toolbar-row">
      <div class="toolbar-group">
        <el-date-picker
          v-model="filterForm.dateRange"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          range-separator="至"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </div>
      <div class="meter-text">{{ meterTypeText }}</div>
    </div>

    <el-table v-loading="loading" :data="tableData" border stripe>
      <el-table-column type="index" label="#" width="60" />
      <el-table-column label="表计类型" min-width="120">
        <template #default="{ row }">
          <el-tag :type="row.meterType === 1 ? 'primary' : 'warning'" effect="light">
            {{ row.meterType === 1 ? "照明" : "空调" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="leftMoney" label="剩余金额" min-width="120" />
      <el-table-column prop="leftEle" label="剩余电量" min-width="120" />
      <el-table-column prop="queryTime" label="查询时间" min-width="180" />
    </el-table>

    <div class="table-footer">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </div>
  </section>
</template>

<style scoped>
.meter-text {
  color: var(--text-soft);
  font-size: 14px;
}

.table-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
