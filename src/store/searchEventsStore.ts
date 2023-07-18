import { create } from 'zustand'

export const useSearchEventsStore = create(
    (set) => ({
        events: [],
        addEvents: (events: Event) => set((state: any) => (state.events = events)),
        emptyEvents: () => set((state: any) => (state.events = []))
    })
)