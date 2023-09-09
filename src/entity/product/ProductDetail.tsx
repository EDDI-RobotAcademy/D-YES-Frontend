import { ProductDetailImg } from "./ProductDetailImg";
import { ProductImg } from "./ProductMainImg";
import { useFarmInfo } from "./useFarmInfo";
import { useOptions } from "./useOptions";
import { useProductInfo } from "./useProductInfo";

export interface ProductDetail {
  productResponse: useProductInfo;
  optionList: Array<useOptions>;
  mainImage: ProductImg;
  detailImagesList: Array<ProductDetailImg>;
  farmInfoResponse: useFarmInfo;
}
