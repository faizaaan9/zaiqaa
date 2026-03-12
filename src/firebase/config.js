import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBNHfrAH0Ilps3-NQeXdKnI-yBjELS59k8",
  authDomain: "zaiqaa.firebaseapp.com",
  projectId: "zaiqaa",
  storageBucket: "zaiqaa.firebasestorage.app",
  messagingSenderId: "704913210729",
  appId: "1:704913210729:web:7c7429df7ae708316c91f8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
