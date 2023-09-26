import { create } from "zustand";
import { EventModify } from "../entity/EventModify";

interface EventModifyState {
  eventModify: EventModify;
  setEventModify: (eventModify: EventModify) => void;
}

export const useEventModifyStore = create<EventModifyState>((set) => ({
  eventModify: {} as EventModify,
  setEventModify: (eventModify) => set({ eventModify }),
}));
export default useEventModifyStore;
