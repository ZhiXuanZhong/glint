import { create } from 'zustand'

interface Store {
    authUser: string;
    authProfile: UsersProfile | null;
    updateAuthUser: (authData: string) => void,
    updateAuthProfile: (profileData: UsersProfile) => void
}

export const useAuthStore = create<Store>(
    (set) => ({
        authUser: '',
        authProfile: null,
        updateAuthUser: (authData: string) => set(() => ({ authUser: authData })),
        updateAuthProfile: (profileData: UsersProfile) => set(() => ({ authProfile: profileData }))
    })
)