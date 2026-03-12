import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup, sendPasswordResetEmail, updateProfile, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase/config";
import toast from "react-hot-toast";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function createUserDoc(uid, data) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) await setDoc(ref, { ...data, createdAt: serverTimestamp(), addresses: [], favourites: [], totalOrders: 0 });
    return (await getDoc(ref)).data();
  }

  async function signup(email, password, name, phone) {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name });
    const profile = await createUserDoc(res.user.uid, { name, email, phone, avatar: "" });
    setUserProfile(profile);
    toast.success(`Ahlan wa Sahlan, ${name}! 🌿`);
    return res;
  }

  async function login(email, password) {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, "users", res.user.uid));
    setUserProfile(snap.data());
    toast.success("Welcome back! 👋");
    return res;
  }

  async function loginWithGoogle() {
    const res = await signInWithPopup(auth, googleProvider);
    const profile = await createUserDoc(res.user.uid, { name: res.user.displayName, email: res.user.email, phone: res.user.phoneNumber || "", avatar: res.user.photoURL || "" });
    setUserProfile(profile);
    toast.success(`Marhaba, ${res.user.displayName}! 🌿`);
    return res;
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
    toast.success("Reset link sent 📧");
  }

  async function logout() {
    await signOut(auth);
    setUserProfile(null);
    toast.success("Khuda Hafiz! 🌿");
  }

  async function sendOTP(phoneNumber) {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
    }
    return await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
  }

  async function refreshProfile() {
    if (!user) return;
    const snap = await getDoc(doc(db, "users", user.uid));
    setUserProfile(snap.data());
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) { const snap = await getDoc(doc(db, "users", u.uid)); if (snap.exists()) setUserProfile(snap.data()); }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signup, login, loginWithGoogle, resetPassword, logout, sendOTP, refreshProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
