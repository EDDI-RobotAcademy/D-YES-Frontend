// import { EventCount } from "./EventCount";
// import { EventDate } from "./EventDate";
// import { EventDetailImage } from "./EventDetailImage";
import { EventDetailImage } from "./EventDetailImage";
import { EventMainImage } from "./EventMainImage";
import { EventModifyDetail } from "./EventModifyDetail";
import { EventModifyToken } from "./EventModifyToken";
import { EventOption } from "./EventOption";

export interface EventModify {
  eventProductId: number;
  productModifyUserTokenAndEventProductIdRequest: EventModifyToken;
  productModifyRequest: EventModifyDetail;
  productOptionModifyRequest: EventOption;
  productMainImageModifyRequest: EventMainImage;
  productDetailImagesModifyRequest: EventDetailImage[];
  // eventProductModifyDeadLineRequest: EventDate;
  // eventProductModifyPurchaseCountRequest: EventCount;
}
