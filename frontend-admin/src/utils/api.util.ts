import type { AxiosError, AxiosRequestConfig } from "axios";
import api from "../api/index";
import { ApiMethod } from "../enums/apiMethod";

export async function apiRequest<TResponse, TBody = unknown>(
  method: ApiMethod,
  url: string,
  data?: TBody,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  try {
    const response = await api.request<TResponse>({
      method,
      url,
      ...(method === ApiMethod.GET ? { params: data } : { data }),
      ...config,
    });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      throw error.response?.data || error;
    }

    console.error("Unknown error:", error);
    throw error;
  }
}

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
}
