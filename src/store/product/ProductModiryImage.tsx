import { create } from "zustand";
import { ProductImg } from "entity/product/ProductMainImg";
import { ProductDetailImg } from "entity/product/ProductDetailImg";

interface ProductModifyImageState {
  productImgs: (ProductImg | Blob );
  productDetailImgs: ProductDetailImg[];
  setProductImgs: (productImgs: (ProductImg | Blob )) => void;
  setProductDetailImgs: (productDetailImgs: ProductDetailImg[]) => void;
}

export const useProductModifyImageStore = create<ProductModifyImageState>((set) => ({
  productImgs: {} as ProductImg,
  productDetailImgs: [],
  setProductImgs: (productImgs) => set({ productImgs }),
  setProductDetailImgs: (productDetailImgs) => set({ productDetailImgs }),
}));
export default useProductModifyImageStore;