import { create } from "zustand";
import { ProductImg } from "entity/product/ProductMainImg";
import { ProductDetailImg } from "entity/product/ProductDetailImg";

interface ProductImageState {
  productImgs: (ProductImg | Blob );
  productDetailImgs: (ProductDetailImg | Blob )[];
  setProductImgs: (productImgs: (ProductImg | Blob )) => void;
  setProductDetailImgs: (productDetailImgs: (ProductDetailImg | Blob)[]) => void;
}

export const useProductImageStore = create<ProductImageState>((set) => ({
  productImgs: {} as ProductImg,
  productDetailImgs: [],
  setProductImgs: (productImgs) => set({ productImgs }),
  setProductDetailImgs: (productDetailImgs) => set({ productDetailImgs }),
}));
export default useProductImageStore;
