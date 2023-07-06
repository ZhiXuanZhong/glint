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
        updateAuthUser(result.user);
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
        <button className="border p-1 mx-1" onClick={handleLogin}>
          Google Login
        </button>
        <button className="border p-1 mx-1" onClick={handleLogout}>
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
  const [loaded, setLoaded] = useState(false);

  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  useEffect(() => {
    setLoaded(true);
  }, [authUser]);

  const handleLogin = () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (!(email && password)) return;

    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        updateAuthUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode, errorMessage);
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
      <div className="flex flex-col">
        <div>使用 Email 登入</div>
        <input className="border max-w-sm" type="text" ref={emailRef} />
        <input className="border max-w-sm" type="password" ref={passwordRef} />
        <button className="border max-w-sm" onClick={handleLogin}>
          Login
        </button>
        <button className="border max-w-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {loaded && <div>now logged as {authUser.uid}</div>}
    </>
  );
};
