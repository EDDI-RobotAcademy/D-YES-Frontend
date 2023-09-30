import { useOptions } from "./useOptions";
import { ProductDetailImg } from "./ProductDetailImg";
import { Product } from "./Product";
import { ProductModifyImg } from "./ProductModifyImg";

export interface ProductModify {
  productId: number;
  productModifyRequest: Partial<Product>;
  productOptionModifyRequest: useOptions[];
  productMainImageModifyRequest: ProductModifyImg;
  productDetailImagesModifyRequest: ProductDetailImg[];
  userToken: string;
}
