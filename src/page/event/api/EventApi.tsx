import { Event } from "../entity/Event";
import { EventCount } from "../entity/EventCount";
import { EventDate } from "../entity/EventDate";
import { EventProduct } from "../entity/EventProduct";
import axiosInstance from "utility/axiosInstance";

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
