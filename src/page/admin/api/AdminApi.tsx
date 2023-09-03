import axiosInstance from "utility/axiosInstance";
import { Admin } from "../entity/Admin";
import { Farm } from "page/farm/entity/Farm";

export const adminRegister = async (data: {
  id: string;
  name: string;
  userToken: string;
}): Promise<Admin> => {
  const response = await axiosInstance.springAxiosInst.post<Admin>("/admin/register", data);
  console.log("api확인", response.data);
  return response.data;
};

// 농가 등록
export const farmRegister = async (data: {
  businessName: string;
  businessNumber: string;
  representativeName: string;
  representativeContactNumber: string;
  farmName: string;
  csContactNumber: string;
  address: string;
  zipCode: string;
  addressDetail: string;
  mainImage: string;
  introduction: string;
  produceTypes: string[];
}): Promise<Farm> => {
  const response = await axiosInstance.springAxiosInst.post<Farm>("/farm/register", data);
  return response.data;
};

// 농가 목록
export const getFarmList = async () => {
  const response = await axiosInstance.springAxiosInst.get("/farm/list");
  return response.data;
};

// 농가 삭제
export const deleteFarm = async (farmId: string): Promise<void> => {
  await axiosInstance.springAxiosInst.delete(`farm/delete/${farmId}`, {
    data: {
      userToken: localStorage.getItem("userToken"),
    },
  });
};
