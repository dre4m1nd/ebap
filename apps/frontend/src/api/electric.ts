import request from "@/utils/request";
import type {
  ApiResponse,
  PageResponse,
  ElectricChartItem,
  ElectricChartQuery,
  ElectricLog,
  ElectricLogQuery,
} from "@ebap/shared";

export function pageElectricLogs(data: ElectricLogQuery) {
  return request<ApiResponse<PageResponse<ElectricLog>>>({
    url: "/electric/list",
    method: "POST",
    data,
  });
}

export function getElectricChart(params: ElectricChartQuery) {
  return request<ApiResponse<ElectricChartItem[]>>({
    url: "/electric/chart",
    method: "GET",
    params,
  });
}
