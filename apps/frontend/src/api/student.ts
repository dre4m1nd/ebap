import request from "@/utils/request";
import type { ApiResponse, Student, StudentForm } from "@ebap/shared";

export function listStudents(dormId: number | undefined) {
  return request<ApiResponse<Student[]>>({
    url: "/student/list",
    method: "GET",
    params: { dormId },
  });
}

export function addStudent(data: StudentForm) {
  return request<ApiResponse<null>>({
    url: "/student/add",
    method: "POST",
    data,
  });
}

export function updateStudent(data: StudentForm & { id: number }) {
  return request<ApiResponse<null>>({
    url: "/student/update",
    method: "PUT",
    data,
  });
}

export function deleteStudent(id: number) {
  return request<ApiResponse<null>>({
    url: `/student/${id}`,
    method: "DELETE",
  });
}
