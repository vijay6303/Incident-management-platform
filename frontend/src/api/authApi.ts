import api from "./axios";
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from "../types/auth";

export async function registerUser(
  data: RegisterRequest
): Promise<void> {
  await api.post("/auth/register", data);
}

export async function loginUser(
  data: LoginRequest
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    data
  );

  return response.data;
}