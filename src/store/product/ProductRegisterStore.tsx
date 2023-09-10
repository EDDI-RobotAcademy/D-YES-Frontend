import { Product } from "entity/product/Product";
import { create } from "zustand";

interface ProductRegisterState {
  products: Product;
  setProducts: (products: Product) => void;
}

export const useProductRegisterStore = create<ProductRegisterState>((set) => ({
  products: {} as Product,
  setProducts: (products) => set({ products }),
}));
export default useProductRegisterStore;
