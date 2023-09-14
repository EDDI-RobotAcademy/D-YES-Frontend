import { FarmInfoRead } from "page/farm/entity/farm/FarmInfoRead";
import { create } from "zustand";

interface FarmReadState {
  farmReads: FarmInfoRead;
  setFarmRead: (farmReads: FarmInfoRead) => void;
}

export const useFarmReadStore = create<FarmReadState>((set) => ({
  farmReads: {} as FarmInfoRead,
  setFarmRead: (farmReads) => set({ farmReads }),
}));

export default useFarmReadStore;
