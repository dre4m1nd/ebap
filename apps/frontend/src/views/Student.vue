<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessageBox } from "element-plus";

import { addStudent, deleteStudent, listStudents, updateStudent } from "@/api/student";
import { useDormStore } from "@/store/useDormStore";
import type { Student, StudentForm } from "@ebap/shared";
import { showInfo, showSuccess } from "@/utils/showMessage";

const dormStore = useDormStore();
const loading = ref(false);
const tableData = ref<Student[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref("新增学生");
const formRef = ref<FormInstance>();
const submitting = ref(false);

const formData = reactive<StudentForm & { id?: number }>({
  nickName: "",
  email: "",
  status: 1,
  dormId: 0,
});

const rules: FormRules<typeof formData> = {
  nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: "blur" },
  ],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
};

const fetchData = async () => {
  if (!dormStore.selectedDormId) {
    tableData.value = [];
    return;
  }

  loading.value = true;
  try {
    const res = await listStudents(dormStore.selectedDormId);
    tableData.value = res.data;
  } finally {
    loading.value = false;
  }
};

const resetFormData = () => {
  formData.id = undefined;
  formData.nickName = "";
  formData.email = "";
  formData.status = 1;
  formData.dormId = dormStore.selectedDormId || 0;
};

const openAddDialog = () => {
  if (!dormStore.selectedDormId) {
    showInfo("请先选择宿舍");
    return;
  }

  dialogTitle.value = "新增学生";
  resetFormData();
  dialogVisible.value = true;
};

const openEditDialog = (row: Student) => {
  dialogTitle.value = "编辑学生";
  formData.id = row.id;
  formData.nickName = row.nickName;
  formData.email = row.email;
  formData.status = row.status;
  formData.dormId = row.dormId;
  dialogVisible.value = true;
};

const submitForm = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  submitting.value = true;
  try {
    if (formData.id) {
      await updateStudent({
        id: formData.id,
        nickName: formData.nickName,
        email: formData.email,
        status: formData.status,
        dormId: formData.dormId,
      });
      showSuccess("学生已更新");
    } else {
      await addStudent({
        nickName: formData.nickName,
        email: formData.email,
        status: formData.status,
        dormId: dormStore.selectedDormId || 0,
      });
      showSuccess("学生已创建");
    }
    dialogVisible.value = false;
    await fetchData();
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (row: Student) => {
  await ElMessageBox.confirm(`确认删除学生 ${row.nickName} 吗？`, "提示", { type: "warning" });
  await deleteStudent(row.id);
  showSuccess("学生已删除");
  await fetchData();
};

watch(() => dormStore.selectedDormId, () => void fetchData(), { immediate: true });
</script>

<template>
  <section class="page-shell">
    <div class="page-intro">
      <h2>学生管理</h2>
    </div>

    <div class="toolbar-row">
      <div />
      <el-button type="primary" @click="openAddDialog">新增学生</el-button>
    </div>

    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column type="index" label="#" width="60" />
      <el-table-column prop="nickName" label="昵称" min-width="140" />
      <el-table-column prop="email" label="邮箱" min-width="240" />
      <el-table-column label="通知状态" min-width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? "接收通知" : "暂停接收" }}
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="88px">
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="formData.nickName" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">接收通知</el-radio>
            <el-radio :value="0">暂停接收</el-radio>
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
