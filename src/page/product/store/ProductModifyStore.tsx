import { ProductModifyResponse } from "page/product/entity/ProductModifyResponse";
import { create } from "zustand";

interface ProductModifyState {
  modifyProducts: ProductModifyResponse;
  setModifyProducts: (modifyProducts: ProductModifyResponse) => void;
}

export const useProductModifyStore = create<ProductModifyState>((set) => ({
  modifyProducts: {} as ProductModifyResponse,
  setModifyProducts: (modifyProducts) => set({ modifyProducts }),
}));
export default useProductModifyStore;
