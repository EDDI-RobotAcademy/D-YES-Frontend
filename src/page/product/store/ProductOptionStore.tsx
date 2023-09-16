import { useOptions } from "page/product/entity/useOptions";
import { create } from "zustand";

type ProductOptionState = {
  optionList: useOptions[];
  setOptionList: (optionList: useOptions[]) => void;
};

const ProductOptionStore = create<ProductOptionState>((set) => ({
  optionList: [],
  setOptionList: (optionList) => set({ optionList }),
}));

export default ProductOptionStore;
