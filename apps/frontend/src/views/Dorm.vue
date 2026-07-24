<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessageBox } from "element-plus";

import { addDorm, deleteDorm, pageDorms, updateDorm } from "@/api/dorm";
import type { Dorm, DormForm } from "@ebap/shared";
import { showSuccess } from "@/utils/showMessage";

const loading = ref(false);
const tableData = ref<Dorm[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const filterForm = reactive({
  dormNo: "",
  status: undefined as number | undefined,
});

const dialogVisible = ref(false);
const dialogTitle = ref("新增宿舍");
const submitting = ref(false);
const formRef = ref<FormInstance>();

const formData = reactive<DormForm & { id?: number }>({
  dormNo: "",
  openId: "",
  limitLight: 0,
  limitAir: 0,
  status: 1,
});

const rules: FormRules<typeof formData> = {
  dormNo: [{ required: true, message: "请输入宿舍号", trigger: "blur" }],
  openId: [{ required: true, message: "请输入 openId", trigger: "blur" }],
  limitLight: [{ required: true, message: "请输入照明阈值", trigger: "blur" }],
  limitAir: [{ required: true, message: "请输入空调阈值", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await pageDorms({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      dormNo: filterForm.dormNo || undefined,
      status: filterForm.status,
    });
    tableData.value = res.data.records;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
};

const resetFormData = () => {
  formData.id = undefined;
  formData.dormNo = "";
  formData.openId = "";
  formData.limitLight = 0;
  formData.limitAir = 0;
  formData.status = 1;
};

const openAddDialog = () => {
  dialogTitle.value = "新增宿舍";
  resetFormData();
  dialogVisible.value = true;
};

const openEditDialog = (row: Dorm) => {
  dialogTitle.value = "编辑宿舍";
  formData.id = row.id;
  formData.dormNo = row.dormNo;
  formData.openId = row.openId;
  formData.limitLight = row.limitLight;
  formData.limitAir = row.limitAir;
  formData.status = row.status;
  dialogVisible.value = true;
};

const submitForm = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  submitting.value = true;
  try {
    if (formData.id) {
      await updateDorm({ ...formData, id: formData.id });
      showSuccess("宿舍已更新");
    } else {
      await addDorm({
        dormNo: formData.dormNo,
        openId: formData.openId,
        limitLight: formData.limitLight,
        limitAir: formData.limitAir,
        status: formData.status,
      });
      showSuccess("宿舍已创建");
    }
    dialogVisible.value = false;
    await fetchData();
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (row: Dorm) => {
  await ElMessageBox.confirm(`确认删除宿舍 ${row.dormNo} 吗？`, "提示", { type: "warning" });
  await deleteDorm(row.id);
  showSuccess("宿舍已删除");
  await fetchData();
};

onMounted(() => {
  void fetchData();
});
</script>

<template>
  <section class="page-shell">
    <div class="page-intro">
      <h2>宿舍管理</h2>
    </div>

    <div class="toolbar-row">
      <div class="toolbar-group">
        <el-input v-model="filterForm.dormNo" placeholder="宿舍号" clearable />
        <el-select v-model="filterForm.status" placeholder="状态" clearable style="width: 140px">
          <el-option label="启用" :value="1" />
          <el-option label="停用" :value="0" />
        </el-select>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </div>
      <el-button type="primary" @click="openAddDialog">新增宿舍</el-button>
    </div>

    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column type="index" label="#" width="60" />
      <el-table-column prop="dormNo" label="宿舍号" min-width="120" />
      <el-table-column prop="openId" label="openId" min-width="220" />
      <el-table-column prop="limitLight" label="照明阈值" min-width="120" />
      <el-table-column prop="limitAir" label="空调阈值" min-width="120" />
      <el-table-column label="状态" min-width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? "启用" : "停用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" min-width="180" />
      <el-table-column label="操作" min-width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="宿舍号" prop="dormNo">
          <el-input v-model="formData.dormNo" />
        </el-form-item>
        <el-form-item label="openId" prop="openId">
          <el-input v-model="formData.openId" />
        </el-form-item>
        <el-form-item label="照明阈值" prop="limitLight">
          <el-input-number v-model="formData.limitLight" :min="0" :precision="1" :step="0.5"/>
        </el-form-item>
        <el-form-item label="空调阈值" prop="limitAir">
          <el-input-number v-model="formData.limitAir" :min="0" :precision="1" :step="0.5"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.table-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
