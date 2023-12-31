import { ProductDetailImg } from "./ProductDetailImg";
import { ProductImg } from "./ProductMainImg";
import { ProductReviewResponseForUser } from "./ProductReview";
import { useFarmInfo } from "./useFarmInfo";
import { useOptions } from "./useOptions";
import { useProductInfo } from "./useProductInfo";

export interface ProductDetail {
  productResponseForUser: useProductInfo;
  optionResponseForUser: Array<useOptions>;
  mainImageResponseForUser: ProductImg;
  detailImagesForUser: Array<ProductDetailImg>;
  farmInfoResponseForUser: useFarmInfo;
  productReviewResponseForUser: ProductReviewResponseForUser;
}
