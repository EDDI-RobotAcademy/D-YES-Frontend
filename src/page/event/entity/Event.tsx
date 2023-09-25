import { EventCount } from "./EventCount";
import { EventDate } from "./EventDate";
import { EventProduct } from "./EventProduct";

export interface Event {
  eventProductRegisterRequest: EventProduct;
  eventProductRegisterDeadLineRequest: EventDate;
  eventProductRegisterPurchaseCountRequest: EventCount;
}
