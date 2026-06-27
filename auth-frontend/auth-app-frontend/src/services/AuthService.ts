import type RegisterData from "@/models/RegisterData";
import apiClient from "@/config/ApiClient";
import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type User from "@/models/User";
import type ChangePasswordRequest from "@/models/ChangePasswordRequest";
//register function
export const registerUser = async (signupData: RegisterData) => {
  // api  call to server to save data
  const response = await apiClient.post(`/auth/register`, signupData);
  return response.data;
};

//login

export const loginUser = async (loginData: LoginData) => {
  const response = await apiClient.post<LoginResponseData>(
    "/auth/login",
    loginData
  );
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post(`/auth/logout`);
  return response.data;
};

//get current login user
export const getCurrentUser = async (emailId: string | undefined) => {
  const response = await apiClient.get<User>(`/users/email/${emailId}`);
  return response.data;
};

//refresh token

export const refreshToken = async () => {
  const response = await apiClient.post<LoginResponseData>(`/auth/refresh`);
  return response.data;
};

//to update the users
export const updateUser = async (userId: string, userData: any) => {
  const response = await apiClient.put(`/users/${userId}`, userData);
  return response.data;
};
export const uploadProfileImage = async (
  userId: string,
  file: File
) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post(
    `/users/${userId}/image`,
    formData
  );

  return response.data;
};



export const changePassword = async (
  userId: string,
  data: ChangePasswordRequest
) => {
  const response = await apiClient.post(
    `/users/${userId}/change-password`,
    data
  );

  return response.data;
};

//to delete the user
export const deleteAccount = async (
  userId: string,
  password: string
) => {
  const response = await apiClient.delete(
    `/users/${userId}/delete-account`,
    {
      data: {
        password,
      },
    }
  );

  return response.data;
};
