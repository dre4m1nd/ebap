import request from "@/utils/request";
import type { ApiResponse, PageResponse, EmailLog, EmailLogForm, EmailLogQuery } from "@ebap/shared";

export function pageEmailLogs(data: EmailLogQuery) {
  return request<ApiResponse<PageResponse<EmailLog>>>({
    url: "/email/page",
    method: "POST",
    data,
  });
}

export function updateEmailLog(id: number, data: EmailLogForm) {
  return request<ApiResponse<null>>({
    url: `/email/${id}`,
    method: "PUT",
    data,
  });

}
