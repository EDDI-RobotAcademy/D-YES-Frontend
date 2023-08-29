import { useOptions } from "./useOptions";
import { ProductImg } from "./ProductMainImg";
import { ProductDetailImg } from "./ProductDetailImg";
import { Product } from "./Product";

export interface ProductModify {
  productId: number;
  productModifyRequest: Partial<Product>;
  productOptionModifyRequest: useOptions[];
  productMainImageModifyRequest: ProductImg;
  productDetailImagesModifyRequest: ProductDetailImg[];
  userToken: string;
}
