import api from "../api/api";
import type { User } from "../types";

export const userService = {
  async getAlunos(): Promise<User[]> {
    const response = await api.get<User[]>("/alunos");
    return response.data;
  },
};
