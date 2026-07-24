import { ElMessage } from "element-plus";

const duration = 2000;

export function showSuccess(message: string) {
  ElMessage({
    message,
    type: "success",
    duration,
    grouping: true,
  });
}

export function showInfo(message: string) {
  ElMessage({
    message,
    type: "info",
    duration,
    grouping: true,
  });
}

export function showWarning(message: string) {
  ElMessage({
    message,
    type: "warning",
    duration,
    grouping: true,
  });
}

export function showError(error: { msg?: string; message?: string }) {
  ElMessage({
    message: error.msg || error.message || "服务异常",
    type: "error",
    duration,
    grouping: true,
  });
}
