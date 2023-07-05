import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type State = {
    userID: string;
    updateUserID: (data: string) => void
}

// type Action = {
//     updateUserID: (data: string) => void
// }


export const useAuthStore = create(persist(
    (set) => ({
        userID: '',
        updateUserID: (authData: string) => set(() => ({ userID: authData }))
    }), {
    name: 'user-id',
    storage: createJSONStorage(() => sessionStorage),
}
))