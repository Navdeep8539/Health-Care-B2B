import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1AnKnIIbAhtxWaZfmeFhI23AFqVgyT_w",
  authDomain: "authentication-75e50.firebaseapp.com",
  projectId: "authentication-75e50",
  storageBucket: "authentication-75e50.firebasestorage.app",
  messagingSenderId: "648514835846",
  appId: "1:648514835846:web:d8cd1c8064340dcc3d0807",
  measurementId: "G-LD7QFNJV13",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const loginWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

export type { User };
