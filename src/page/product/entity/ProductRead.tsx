import { Product } from "./Product";
import { Farm } from "page/farm/entity/farm/Farm";
import { useOptions } from "./useOptions";
import { ProductDetailImg } from "./ProductDetailImg";
import { ProductModifyImg } from "./ProductModifyImg";

export interface ProductRead {
  productResponseForAdmin: Product;
  farmInfoResponseForAdmin: Farm;
  optionResponseForAdmin: useOptions[];
  mainImageResponseForAdmin: ProductModifyImg;
  detailImagesForAdmin: ProductDetailImg[];
}
