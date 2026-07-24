import request from "@/utils/request";
import type { ApiResponse, LoginPayload, LoginResult } from "@ebap/shared";

const loginPath = import.meta.env.VITE_LOGIN_PATH || "/auth/login";

export function login(data: LoginPayload) {
  return request<ApiResponse<LoginResult>>({
    url: loginPath,
    method: "POST",
    data,
  });
}
