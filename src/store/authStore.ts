import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { shallow } from 'zustand/shallow'

// type State = {
//     authUser: string;
//     updateUserID: (data: string) => void
// }

// type Action = {
//     updateUserID: (data: string) => void
// }


export const useAuthStore = create(persist(
    (set) => ({
        authUser: {},
        updateAuthUser: (authData: string) => set(() => ({ authUser: authData }))
    }), {
    name: 'user',
    storage: createJSONStorage(() => localStorage),
}
))