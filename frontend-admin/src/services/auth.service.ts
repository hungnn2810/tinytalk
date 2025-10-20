import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from "../models/auth.model";
import { apiRequest } from "../utils/api.util";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiRequest<LoginResponse>("post", "/auth/login", data);

  // Lưu token
  localStorage.setItem("accessToken", res.accessToken);
  if (res.refreshToken) localStorage.setItem("refreshToken", res.refreshToken);
  return res;
}

export async function refreshAccessToken(
  token: string
): Promise<string | null> {
  if (!token) {
    return null;
  }

  const res = await apiRequest<RefreshTokenResponse>("post", "/auth/refresh", {
    token: token,
  });

  if (!res) {
    localStorage.removeItem("accessToken");
    return null;
  }

  localStorage.setItem("accessToken", res.accessToken);
  return res.accessToken;
}
