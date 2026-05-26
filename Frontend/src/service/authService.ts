import apiClient from "../lib/apiClients";
import { LoginAccount } from "../types";

export const login = async (email: string, password: string) => {
  const response = await apiClient.post<LoginAccount>(
    "http://197.156.110.130:9000/api/user-management/login/",
    {
      email,
      password,
    }
  );

  return response.data; // Return the response data instead of setting it in sessionStorage
};
