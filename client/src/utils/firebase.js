import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { firebaseConfig } from '../../../secrets/config';

initializeApp(firebaseConfig);

export const getCurrentUser = async () => {
  const auth = getAuth();

  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
};

export const getTokenId = async () => {
  const auth = getAuth();
  const token = await auth.currentUser.getIdToken();

  return token;
};

export const signIn = async () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    return null;
  }
};

export const signOut = async () => {
  const auth = getAuth();

  await auth.signOut();
};
