import { create } from 'zustand'

interface Store {
    authUser: string;
    authProfile: string;
    updateAuthUser: (authData: string) => void,
    updateAuthProfile: (profileData: string) => void
}

export const useAuthStore = create<Store>(
    (set) => ({
        authUser: '',
        authProfile: '',
        updateAuthUser: (authData: string) => set(() => ({ authUser: authData })),
        updateAuthProfile: (profileData: string) => set(() => ({ authProfile: profileData }))
    })
)