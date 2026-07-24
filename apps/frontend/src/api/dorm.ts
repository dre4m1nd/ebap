import request from "@/utils/request";
import type { ApiResponse, PageResponse, Dorm, DormForm, DormQuery } from "@ebap/shared";

export function listDorms() {
  return request<ApiResponse<Dorm[]>>({
    url: "/dorm/list",
    method: "GET",
  });
}

export function pageDorms(params: DormQuery) {
  return request<ApiResponse<PageResponse<Dorm>>>({
    url: "/dorm/page",
    method: "GET",
    params,
  });
}

export function addDorm(data: DormForm) {
  return request<ApiResponse<null>>({
    url: "/dorm/add",
    method: "POST",
    data,
  });
}

export function updateDorm(data: DormForm & { id: number }) {
  return request<ApiResponse<null>>({
    url: `/dorm/${data.id}`,
    method: "PUT",
    data,
  });
}

export function deleteDorm(id: number) {
  return request<ApiResponse<null>>({
    url: `/dorm/${id}`,
    method: "DELETE",
  });
}
