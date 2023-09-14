import { create } from "zustand";
import { ProductImg } from "page/product/entity/ProductMainImg";
import { ProductDetailImg } from "page/product/entity/ProductDetailImg";

interface ProductImageState {
  productImgs: ProductImg | Blob;
  productDetailImgs: (ProductDetailImg | Blob)[];
  setProductImgs: (productImgs: ProductImg | Blob) => void;
  setProductDetailImgs: (productDetailImgs: (ProductDetailImg | Blob)[]) => void;
}

export const useProductImageStore = create<ProductImageState>((set) => ({
  productImgs: {} as ProductImg,
  productDetailImgs: [],
  setProductImgs: (productImgs) => set({ productImgs }),
  setProductDetailImgs: (productDetailImgs) => set({ productDetailImgs }),
}));
export default useProductImageStore;
