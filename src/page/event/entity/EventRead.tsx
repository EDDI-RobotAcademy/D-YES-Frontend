import { Farm } from "page/farm/entity/farm/Farm";
import { EventDetailImage } from "./EventDetailImage";
import { EventMainImage } from "./EventMainImage";
import { EventModifyDetail } from "./EventModifyDetail";
import { EventOption } from "./EventOption";
import { EventDate } from "aws-sdk/clients/codecommit";
import { EventCount } from "./EventCount";

export interface EventRead {
  productResponseForUser: EventModifyDetail;
  optionResponseForUser: EventOption;
  mainImageResponseForUser: EventMainImage;
  detailImagesForUser: EventDetailImage;
  farmInfoResponseForUser: Farm;
  eventProductDeadLineResponse: EventDate;
  eventProductPurchaseCountResponse: EventCount;
}
