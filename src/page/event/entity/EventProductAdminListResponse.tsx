import { EventProductDeadLineResponse } from "page/event/entity/EventProductDeadLineResponse";
import { FarmInfoForUser } from "page/product/entity/ProductListFarmInfo";
import { ProductOptionForUser } from "page/product/entity/ProductListOption";
import { ProductListForUser } from "page/product/entity/ProductListProductInfo";
import { ProductMainImageForUser } from "page/product/entity/ProductMainImg";
import { ProductReviewResponseForUser } from "page/product/entity/ProductReview";
import { EventProductPurchaseCountResponse } from "./EventProductPurchaseCountResponse";

export interface EventProductAdminListResponse {
  productResponseForListForUser: ProductListForUser;
  productMainImageResponseForListForUser: ProductMainImageForUser;
  productOptionResponseForListForUser: ProductOptionForUser;
  farmInfoResponseForListForUser: FarmInfoForUser;
  productReviewResponseForUser: ProductReviewResponseForUser;
  deadLineResponse: EventProductDeadLineResponse;
  countResponse: EventProductPurchaseCountResponse;
}
