import { create } from "zustand";
import { Farm } from "../entity/Farm";

interface FarmState {
  farms: Farm[];
  setFarms: (farms: Farm[]) => void;
}

export const useFarmStore = create<FarmState>((set) => ({
  farms: [],
  setFarms: (farms) => set({ farms }),
}));
export default useFarmStore;
