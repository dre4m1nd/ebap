<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";

import { pageEmailLogs } from "@/api/emailLog";
import { listStudents } from "@/api/student";
import { useDormStore } from "@/store/useDormStore";
import type { SelectOption, EmailLog } from "@ebap/shared";


const dormStore = useDormStore();
const loading = ref(false);
const tableData = ref<EmailLog[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const studentOptions = ref<SelectOption[]>([]);

const filterForm = reactive({
  studentId: undefined as number | undefined,
  dateRange: [] as string[],
});


const studentNameMap = computed(() => new Map(studentOptions.value.map((item) => [item.value, item.label])));

const loadStudents = async () => {
  if (!dormStore.selectedDormId) {
    studentOptions.value = [];
    return;
  }
  const res = await listStudents(dormStore.selectedDormId);
  studentOptions.value = res.data.map((item) => ({
    label: `${item.nickName} / ${item.email}`,
    value: item.id,
  }));
};

const fetchData = async () => {
  if (!dormStore.selectedDormId) {
    tableData.value = [];
    total.value = 0;
    return;
  }

  loading.value = true;
  try {
    const res = await pageEmailLogs({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      dormId: dormStore.selectedDormId,
      studentId: filterForm.studentId,
      startTime: filterForm.dateRange[0],
      endTime: filterForm.dateRange[1],
    });
    tableData.value = res.data.records;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
};


watch(
  () => dormStore.selectedDormId,
  async () => {
    currentPage.value = 1;
    await loadStudents();
    await fetchData();
  },
  { immediate: true },
);
</script>

<template>
  <section class="page-shell">
    <div class="page-intro">
      <h2>邮件记录</h2>
    </div>

    <div class="toolbar-row">
      <div class="toolbar-group">
        <el-select v-model="filterForm.studentId" placeholder="学生" clearable style="width: 280px">
          <el-option
            v-for="item in studentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="filterForm.dateRange"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          range-separator="至"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
        <el-button type="primary" @click="fetchData">查询</el-button>
      </div>
    </div>

    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column type="index" label="#" width="100" />
      <el-table-column label="学生" min-width="380">
        <template #default="{ row }">
          {{ studentNameMap.get(row.studentId) || `学生 ${row.studentId}` }}
        </template>
      </el-table-column>
      <el-table-column prop="sendTime" label="发送时间" min-width="180" />
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
.table-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
