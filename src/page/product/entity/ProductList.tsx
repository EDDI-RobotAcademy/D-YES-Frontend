import { ProductMainImageForUser } from "./ProductMainImg";
import { ProductListForUser } from "./ProductListProductInfo";
import { ProductOptionForUser } from "./ProductListOption";
import { FarmInfoForUser } from "./ProductListFarmInfo";
import { ProductReviewResponseForUser } from "./ProductReview";
import { FarmProducePriceChangeForUser } from "./ProductlListPriceChange";

export interface ProductListResponseFormForUser {
  productResponseForListForUser: ProductListForUser;
  productMainImageResponseForListForUser: ProductMainImageForUser;
  productOptionResponseForListForUser: ProductOptionForUser;
  farmInfoResponseForListForUser: FarmInfoForUser;
  productReviewResponseForUser: ProductReviewResponseForUser;
  farmProducePriceChangeInfoForListForUser: FarmProducePriceChangeForUser;
}
