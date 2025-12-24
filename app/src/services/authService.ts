import { login as loginRequest } from "../api/api";
import type { User } from "../types";

interface LoginResponse {
  token: string;
  user: User;
}

export async function loginService(
  matricula: string,
  password: string
): Promise<LoginResponse> {
  const response = await loginRequest({ matricula, password });

  const { token, user } = response.data;

  localStorage.setItem("authToken", token);
  localStorage.setItem("name", user.name);
  localStorage.setItem("matricula", user.matricula);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
}
