import { Event } from "../entity/Event";
import { EventCount } from "../entity/EventCount";
import { EventDate } from "../entity/EventDate";
import { EventProduct } from "../entity/EventProduct";
import axiosInstance from "utility/axiosInstance";
import { EventRead } from "../entity/EventRead";
import { EventModify } from "../entity/EventModify";
import { EventProductAdminListResponseForm } from "../entity/EventProductAdminListResponseForm";
import { UseQueryResult, useQuery } from "react-query";
import { EventReadForUser } from "../entity/EventReadForUser";
import { EventProductListResponseForm } from "../entity/EventProductListResponseForm";

// 이벤트 등록
export const registerEvent = async (data: {
  eventProductRegisterRequest: EventProduct;
  eventProductRegisterDeadLineRequest: EventDate;
  eventProductRegisterPurchaseCountRequest: EventCount;
}): Promise<Event> => {
  const response = await axiosInstance.post<Event>("/event/register", data);
  console.log("api데이터 확인", response.data);
  return response.data;
};

// 이벤트 목록
export const getEventList = async () => {
  const response = await axiosInstance.get("/event/admin/list/all");
  console.log("받은 데이터", response.data);
  return response.data;
};

// 이벤트 수정 전 읽어오기
export const fetchEvent = async (eventProductId: string): Promise<EventRead | null> => {
  const response = await axiosInstance.get(`event/read/${eventProductId}`);
  console.log("읽기", response.data);
  return response.data;
};

export const updateEvent = async (updatedData: EventModify): Promise<EventModify> => {
  const {
    eventProductId,
    productModifyUserTokenAndEventProductIdRequest,
    productModifyRequest,
    productOptionModifyRequest,
    productMainImageModifyRequest,
    productDetailImagesModifyRequest,
    eventProductModifyDeadLineRequest,
    eventProductModifyPurchaseCountRequest,
  } = updatedData;
  const response = await axiosInstance.put<EventModify>(`/event/modify/${eventProductId}`, {
    eventProductId,
    productModifyUserTokenAndEventProductIdRequest,
    productModifyRequest,
    productOptionModifyRequest,
    productMainImageModifyRequest,
    productDetailImagesModifyRequest,
    eventProductModifyDeadLineRequest,
    eventProductModifyPurchaseCountRequest,
  });
  console.log("수정데이터", response.data);
  return response.data;
};

// 사용자용 이벤트 상품 리스트 확인
export const getEventProductList = async () => {
  const response = await axiosInstance.get<EventProductListResponseForm>("/event/list/all");
  console.log("이벤트 상품 리스트 데이터", response.data);
  return response.data;
};

// 사용자용 이벤트 상품 상세 읽기
export const getEventProductDetail = async (
  eventProductId: string
): Promise<EventReadForUser | null> => {
  const response = await axiosInstance.get<EventReadForUser>(`/event/read/${eventProductId}`);
  console.log(response.data);
  return response.data;
};

export const useEventProductDetailQuery = (
  eventProductId: string
): UseQueryResult<EventReadForUser | null, unknown> => {
  return useQuery(
    ["eventProductRead", eventProductId],
    () => getEventProductDetail(eventProductId),
    {
      refetchOnWindowFocus: false,
    }
  );
};

// 관리자 이벤트 상품 삭제
export const deleteEventProduct = async (eventProductId: string) => {
  await axiosInstance.delete(`/event/delete/${eventProductId}`, {
    params: {
      userToken: localStorage.getItem("userToken"),
    },
  });
};
