import { create } from 'zustand'

interface store {
    events: Event[];
    addEvents: (events: Event[]) => void;
    emptyEvents: () => void;
}

export const useSearchEventsStore = create<store>((set) => ({
    events: [],
    addEvents: (events) => set((state) => ({ ...state, events: events })),
    emptyEvents: () => set((state) => ({ ...state, events: [] }))
}));