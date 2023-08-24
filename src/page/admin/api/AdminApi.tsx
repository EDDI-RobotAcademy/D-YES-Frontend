import axiosInstance from "utility/axiosInstance";
import { Admin } from "../entity/Admin";

export const adminRegister = async (data: {
  id: string;
  name: string;
  userToken: string;
}): Promise<Admin> => {
  const response = await axiosInstance.springAxiosInst.post<Admin>("/admin/register", data);
  console.log("api확인", response.data);
  return response.data;
};
