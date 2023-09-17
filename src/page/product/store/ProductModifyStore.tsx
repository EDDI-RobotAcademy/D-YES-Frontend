import { ProductModifyResponse } from "page/product/entity/ProductModifyResponse";
import { create } from "zustand";

interface ProductModifyState {
  products: ProductModifyResponse;
  setProducts: (products: ProductModifyResponse) => void;
}

export const useProductModifyStore = create<ProductModifyState>((set) => ({
  products: {} as ProductModifyResponse,
  setProducts: (products) => set({ products }),
}));
export default useProductModifyStore;
