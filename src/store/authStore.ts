import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { shallow } from 'zustand/shallow'



export const useAuthStore = create(
    (set) => ({
        authUser: '',
        authProfile: '',
        updateAuthUser: (authData: string) => set(() => ({ authUser: authData })),
        updateAuthProfile: (profileData: string) => set(() => ({ authProfile: profileData }))
    })
)