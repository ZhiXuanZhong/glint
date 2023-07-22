import { create } from 'zustand'

interface Store {
    authUser: string;
    authProfile: UsersProfile | null;
    updateAuthUser: (authData: string) => void,
    updateAuthProfile: (profileData: UsersProfile | null) => void
}

export const useAuthStore = create<Store>(
    (set) => ({
        authUser: '',
        authProfile: null,
        updateAuthUser: (authData: string) => set(() => ({ authUser: authData })),
        updateAuthProfile: (profileData) => set(() => ({ authProfile: profileData }))
    })
)