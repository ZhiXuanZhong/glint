'use client';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useRef, useState } from 'react';
import { app } from '@/app/utils/firebaseConfig';

export const GoogleLogin = () => {
  const provider = new GoogleAuthProvider();
  const [authUser, updateAuthUser] = useAuthStore((state) => [state.authUser, state.updateAuthUser]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, [authUser]);

  const handleLogin = () => {
    const auth = getAuth(app);
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...

        console.log(result);
        updateAuthUser(result.user.uid);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const handleLogout = () => {
    const auth = getAuth(app);
    signOut(auth)
      .then(() => {
        console.log('Sign-out successful.');
        // Sign-out successful.
        updateAuthUser('');
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <>
      <div>
        {' '}
        <button className="mx-1 border p-1" onClick={handleLogin}>
          Google Login
        </button>
        <button className="mx-1 border p-1" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {loaded && <div>now logged as {authUser.uid}</div>}
    </>
  );
};

export const EmailLogin = () => {
  const provider = new GoogleAuthProvider();
  const [authUser, updateAuthUser] = useAuthStore((state) => [state.authUser, state.updateAuthUser]);
  const [authProfile, updateAuthProfile] = useAuthStore((state) => [state.authProfile, state.updateAuthProfile]);
  const [loaded, setLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  const getProfile = async (userID: string) => {
    const response = await fetch(`/api/profile/${userID}`, { next: { revalidate: 5 } });
    return response.json();
  };

  useEffect(() => {
    setLoaded(true);
  }, [authUser]);

  useEffect(() => {
    setIsProcessing(false);
  }, [authProfile]);

  const handleLogin = () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (!(email && password)) return;

    setIsProcessing(true);
    const auth = getAuth(app);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        updateAuthUser(user.uid);
        getProfile(user.uid).then((res) => updateAuthProfile(res[user.uid]));
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode, errorMessage);
      });

    // setIsProcessing(isProcessing);
  };

  const handleLogout = () => {
    const auth = getAuth(app);
    signOut(auth)
      .then(() => {
        console.log('Sign-out successful.');
        // Sign-out successful.
        updateAuthUser('');
        updateAuthProfile('');
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <>
      <div className="flex flex-col ">
        <div className="mb-3 text-center">使用 Email 登入</div>
        <div className="mb-3">
          <div className="flex">
            <div className="w-14">Email</div>
            <input className="max-w-sm border" type="text" ref={emailRef} defaultValue="demo1@demo.com" />
          </div>
          <div className="flex">
            <div className="w-14">密碼</div>
            <input className="max-w-sm border" type="password" ref={passwordRef} defaultValue="demo1@demo.com" />
          </div>
        </div>
        {authProfile ? (
          <button className="max-w-sm border" onClick={handleLogout}>
            登出
          </button>
        ) : (
          <button className="max-w-sm border" onClick={handleLogin}>
            {isProcessing ? '登入中...' : '登入'}
          </button>
        )}
      </div>
    </>
  );
};
