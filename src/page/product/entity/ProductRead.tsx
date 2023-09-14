import { Product } from "./Product";
import { Farm } from "page/farm/entity/farm/Farm";
import { useOptions } from "./useOptions";
import { ProductImg } from "./ProductMainImg";
import { ProductDetailImg } from "./ProductDetailImg";

export interface ProductRead {
  productResponseForAdmin: Product;
  farmInfoResponseForAdmin: Farm;
  optionResponseForAdmin: useOptions[];
  mainImageResponseForAdmin: ProductImg;
  detailImagesForAdmin: ProductDetailImg[];
}
