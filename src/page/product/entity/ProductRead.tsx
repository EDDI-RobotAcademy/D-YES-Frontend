import { Farm } from "page/farm/entity/Farm";
import { useOptions } from "./useOptions";
import { ProductImg } from "./ProductMainImg";
import { ProductDetailImg } from "./ProductDetailImg";
import { Product } from "./Product";

export interface ProductRead {
  productResponseForAdmin: Product;
  farmInfoResponseForAdmin: Farm;
  optionResponseForAdmin: useOptions[];
  mainImageResponseForAdmin: ProductImg;
  detailImagesForAdmin: ProductDetailImg[];
}
