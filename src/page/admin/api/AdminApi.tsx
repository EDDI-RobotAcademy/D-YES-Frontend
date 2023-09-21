import axiosInstance from "utility/axiosInstance";
import { Farm } from "page/farm/entity/farm/Farm";
import { FarmRead } from "page/farm/entity/farm/FarmRead";
import { FarmModify } from "page/farm/entity/farm/FarmModify";
import { Admin } from "../entity/Admin";
import { OrderDeliveryStatus } from "page/order/entity/OrderDeliveryStatus";
import { AdminOrderResponseDetail } from "page/order/entity/AdminOrderResponseDetail";

export const adminRegister = async (data: {
  id: string;
  name: string;
  userToken: string;
}): Promise<Admin> => {
  const response = await axiosInstance.post<Admin>("/admin/register", data);
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
  const response = await axiosInstance.post<Farm>("/farm/register", data);
  return response.data;
};

// 농가 목록
export const getFarmList = async () => {
  const response = await axiosInstance.get("/farm/list");
  return response.data;
};

// 농가 삭제
export const deleteFarm = async (farmId: string): Promise<void> => {
  await axiosInstance.delete(`farm/delete/${farmId}`, {
    data: {
      userToken: localStorage.getItem("userToken"),
    },
  });
};

// 농가 정보 읽기
export const fetchFarm = async (farmId: string): Promise<FarmRead | null> => {
  const response = await axiosInstance.get(`farm/read/${farmId}`);
  return response.data;
};

// 농가 수정
export const updateFarm = async (updatedData: FarmModify): Promise<FarmModify> => {
  const {
    farmId,
    csContactNumber,
    mainImage,
    introduction,
    produceTypes,
    userToken = localStorage.getItem("userToken"),
  } = updatedData;
  const response = await axiosInstance.put<FarmModify>(`farm/modify/${farmId}`, {
    userToken,
    csContactNumber,
    mainImage,
    introduction,
    produceTypes,
  });
  return response.data;
};

// 유저 목록
export const getUserList = async () => {
  const response = await axiosInstance.get("/user/list", {
    params: {
      userToken: localStorage.getItem("userToken"),
    },
  });
  return response.data;
};

// 주문 조회
export const getOrderList = async () => {
  const response = await axiosInstance.get("/order/admin/list", {
    params: {
      userToken: localStorage.getItem("userToken"),
    },
  });
  return response.data;
};

// 주문 상태 변경
export const changeOrderStatus = async (data: {
  productOrderId: string;
  deliveryStatus: string;
  deliveryDate: string;
  userToken: string;
}): Promise<OrderDeliveryStatus> => {
  const response = await axiosInstance.post<OrderDeliveryStatus>("/delivery/change-status", data);
  return response.data;
};

// 주문 조회 시 주문 상세 정보
export const fetchOrderRead = async (
  productOrderId: string
): Promise<AdminOrderResponseDetail | null> => {
  const response = await axiosInstance.get<AdminOrderResponseDetail>(`/order/admin/combine-order-data/${productOrderId}`);
  return response.data;
};
