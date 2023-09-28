import { EventOption } from "./EventOption";
import { EventDate } from "./EventDate";
import { EventProduceType } from "./EventProduceType";
import { EventDetail } from "./EventDetail";
import { EventMainImageForUser } from "./EventMainImageForUser";
import { EventDetailImageForUser } from "./EventDetailImageForUser";
import { ProductReviewResponseForUser } from "page/product/entity/ProductReview";
import { useFarmInfo } from "page/product/entity/useFarmInfo";
import { EventCountForUser } from "./EventCountForUser";

export interface EventReadForUser {
  productResponseForUser: EventDetail;
  eventProductProduceTypeResponse: EventProduceType;
  optionResponseForUser: EventOption;
  mainImageResponseForUser: EventMainImageForUser;
  detailImagesForUser: EventDetailImageForUser[];
  farmInfoResponseForUser: useFarmInfo;
  productReviewResponseForUser: ProductReviewResponseForUser;
  eventProductDeadLineResponse: EventDate;
  eventProductPurchaseCountResponse: EventCountForUser;
}
