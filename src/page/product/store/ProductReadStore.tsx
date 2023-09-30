import { create } from "zustand";
import { ProductRead } from "../entity/ProductRead";

interface ProductReadState {
  productReads: ProductRead;
  setProductRead: (productReads: ProductRead) => void;
}

export const useProductReadStore = create<ProductReadState>((set) => ({
  productReads: {} as ProductRead,
  setProductRead: (productReads) => set({ productReads }),
}));

export default useProductReadStore;
