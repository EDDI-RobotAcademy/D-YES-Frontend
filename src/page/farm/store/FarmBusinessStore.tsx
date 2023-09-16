import { Business } from "page/farm/entity/farm/Business";
import { create } from "zustand";

interface FarmBusinessState {
  business: Business;
  setBusiness: (farms: Business) => void;
}

export const useFarmBusinessStore = create<FarmBusinessState>((set) => ({
  business: {} as Business,
  setBusiness: (business) => set({ business }),
}));

export default useFarmBusinessStore;
