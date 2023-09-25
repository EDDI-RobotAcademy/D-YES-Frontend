import { create } from "zustand";
import { Event } from "../entity/Event";

interface EventState {
  events: Event;
  setEvents: (events: Event) => void;
}

export const useEventStore = create<EventState>((set) => ({
  events: {} as Event,
  setEvents: (events) => set({ events }),
}));
export default useEventStore;
