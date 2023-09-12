import { Farm } from "entity/farm/Farm";
import { create } from "zustand";

interface FarmState {
  farms: Farm;
  setFarms: (farms: Farm) => void;
}

export const useFarmStore = create<FarmState>((set) => ({
  farms: {} as Farm,
  setFarms: (farms) => set({ farms }),
}));

export default useFarmStore;
