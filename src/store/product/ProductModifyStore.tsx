import { ProductModify } from "entity/product/ProductModify";
import { create } from "zustand";

interface ProductModifyState {
  products: ProductModify;
  setProducts: (products: ProductModify) => void;
}

export const useProductModifyStore = create<ProductModifyState>((set) => ({
  products: {} as ProductModify,
  setProducts: (products) => set({ products }),
}));
export default useProductModifyStore;
