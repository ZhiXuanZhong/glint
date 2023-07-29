'use client';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/app/utils/firebaseConfig';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

const GetFireSignState = () => {
  const [authUser, updateAuthUser] = useAuthStore((state) => [state.authUser, state.updateAuthUser]);
  const [authProfile, updateAuthProfile] = useAuthStore((state) => [state.authProfile, state.updateAuthProfile]);

  const auth = getAuth(app);

  const getProfile = async (userID: string) => {
    const response = await fetch(`/api/profile/${userID}`, { next: { revalidate: 5 } });
    return response.json();
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(uid);

        updateAuthUser(uid);
        getProfile(uid).then((res) => updateAuthProfile(res[uid]));
      } else {
        console.log('signed out');
        // User is signed out
        // ...
      }
    });
  }, []);

  return null;
};

export default GetFireSignState;
