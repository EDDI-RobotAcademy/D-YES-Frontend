import { Product } from "entity/product/Product";
import { create } from "zustand";

interface ProductState {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
}));
export default useProductStore;
