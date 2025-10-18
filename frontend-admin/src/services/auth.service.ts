import { apiRequest } from "../api/apiHelper";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiRequest<LoginResponse>("post", "/auth/login", data);

  // Lưu token
  localStorage.setItem("accessToken", res.accessToken);
  if (res.refreshToken) localStorage.setItem("refreshToken", res.refreshToken);

  return res;
}
