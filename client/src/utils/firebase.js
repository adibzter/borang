import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../../secrets/config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getCurrentUser = async () => {
  const auth = getAuth();

  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
};

export const signIn = async () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const signOut = async () => {
  const auth = getAuth();

  await auth.signOut();
};

export const addSubscription = async (email) => {
  console.log(email);
  const subscriptionData = {
    stripe: {
      customer: {
        id: 'cus_OpvYisXe1tMUi2',
        email,
      },
      subscription: {
        id: 'sub_1O2FceBNLCONpnH901M1YOcE',
        status: 'active',
        start_date: 1697558156,
      },
    },
  };
  await setDoc(doc(db, 'subscriptions', email), subscriptionData);
};
