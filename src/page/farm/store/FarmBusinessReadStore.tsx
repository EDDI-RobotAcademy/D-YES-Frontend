import { FarmBusinessRead } from "page/farm/entity/farm/FarmBusinessRead";
import { create } from "zustand";

interface FarmBusinessReadState {
  businessRead: FarmBusinessRead;
  setBusinessRead: (farms: FarmBusinessRead) => void;
}

export const useFarmBusinessReadStore = create<FarmBusinessReadState>((set) => ({
  businessRead: {} as FarmBusinessRead,
  setBusinessRead: (businessRead) => set({ businessRead }),
}));

export default useFarmBusinessReadStore;
