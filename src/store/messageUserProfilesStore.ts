import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

interface UsersProfileWithConversationID extends UsersProfile {
    conversationID?: string
}

type State = {
    profiles: UsersProfileWithConversationID[]
}

type Action = {
    addProfile: (profile: UsersProfile[]) => void
}


export const useProfilesStore = create<State & Action>(
    (set) => (
        {
            profiles: [],
            addProfile: (profile) => set((state) => ({ profiles: [...state.profiles, ...profile] })),
        }
    )
);