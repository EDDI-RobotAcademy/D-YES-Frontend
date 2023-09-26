import { create } from "zustand";
import { EventRead } from "../entity/EventRead";

interface EventReadState {
  eventReads: EventRead;
  setEventRead: (eventReads: EventRead) => void;
}

export const useEventReadStore = create<EventReadState>((set) => ({
  eventReads: {} as EventRead,
  setEventRead: (eventReads) => set({ eventReads }),
}));

export default useEventReadStore;
