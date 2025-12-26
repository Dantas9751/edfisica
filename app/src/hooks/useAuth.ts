import { useNavigate } from "react-router-dom";
import { loginService } from "../services/authService";
import type { User } from "../types";
import { useState } from "react";

export function useAuth() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(() => {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  });

  const login = async (matricula: string, password: string): Promise<User> => {
    const { user: userData } = await loginService(matricula, password);
    setUser(userData);
    navigate("/home");
    return userData;
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      const updatedUser = { ...prevUser, ...data };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return { login, logout, user, updateUser };
}
