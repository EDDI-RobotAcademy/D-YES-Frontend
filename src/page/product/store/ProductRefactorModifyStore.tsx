import { create } from "zustand";
import { ProductModify } from "../entity/ProductModify";

interface ProductModifyState {
  modifyProducts: ProductModify;
  setModifyProducts: (modifyProducts: ProductModify) => void;
}

export const useProductModifyRefactorStore = create<ProductModifyState>((set) => ({
  modifyProducts: {} as ProductModify,
  setModifyProducts: (modifyProducts) => set({ modifyProducts }),
}));
export default useProductModifyRefactorStore;
