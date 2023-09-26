import { Farm } from "page/farm/entity/farm/Farm";
import { EventDetailImage } from "./EventDetailImage";
import { EventMainImage } from "./EventMainImage";
import { EventModifyDetail } from "./EventModifyDetail";
import { EventOption } from "./EventOption";
import { EventCount } from "./EventCount";
import { EventDate } from "./EventDate";

export interface EventRead {
  productResponseForUser: EventModifyDetail;
  optionResponseForUser: EventOption;
  mainImageResponseForUser: EventMainImage;
  detailImagesForUser: EventDetailImage[];
  farmInfoResponseForUser: Farm;
  eventProductDeadLineResponse: EventDate;
  eventProductPurchaseCountResponse: EventCount;
}
