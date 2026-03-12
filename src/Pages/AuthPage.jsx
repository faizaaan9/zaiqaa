import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Loader2, Chrome } from "lucide-react";
import toast from "react-hot-toast";
import ZaiqaaLogo from "../components/ZaiqaaLogo";

export default function AuthPage() {
  const { signup, login, loginWithGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [show, setShow] = useState(false); const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name:"", email:"", password:"", phone:"" });
  const set = k => e => setF({...f,[k]:e.target.value});

  async function submit(e) {
    e.preventDefault(); setLoading(true);
    try {
      if (mode==="signup") await signup(f.email, f.password, f.name, f.phone);
      else if (mode==="login") await login(f.email, f.password);
      else { await resetPassword(f.email); setMode("login"); }
    } catch(err) { toast.error(err.message?.replace("Firebase: ","").replace("Error (","").replace(").","") || "Something went wrong"); }
    finally { setLoading(false); }
  }

  async function google() {
    setLoading(true);
    try { await loginWithGoogle(); }
    catch(err) { toast.error("Google sign-in failed"); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#f5f7f5] flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-z-800 via-z-700 to-z-950 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500 opacity-10 rounded-full blur-3xl"/>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-z-400 opacity-10 rounded-full blur-2xl"/>
        </div>
        <div className="relative text-center text-white px-12">
          <div className="text-7xl mb-6">🫕</div>
          <h2 className="font-display text-4xl font-bold mb-3">Zaiqaa</h2>
          <p className="text-z-200 text-lg italic mb-8">"Taste the Authentic"</p>
          <div className="grid grid-cols-3 gap-4">
            {[["🌿","100% Halal"],["🚀","Fast Delivery"],["⭐","Top Rated"]].map(([e,l])=>(
              <div key={l} className="bg-white/10 rounded-2xl p-4 text-center"><div className="text-2xl mb-1">{e}</div><div className="text-xs text-z-200 font-medium">{l}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8 lg:hidden"><ZaiqaaLogo size="lg" dark/></div>
          <div className="card p-8">
            <h1 className="font-display text-2xl font-bold text-z-900 mb-1">
              {mode==="login"?"Welcome back":mode==="signup"?"Create account":"Reset password"}
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              {mode==="login"?"Sign in to continue":mode==="signup"?"Join the Zaiqaa family":"We'll send a reset link"}
            </p>

            <form onSubmit={submit} className="space-y-4">
              {mode==="signup"&&(
                <>
                  <input placeholder="Full name" value={f.name} onChange={set("name")} className="z-input" required/>
                  <input placeholder="Phone number" value={f.phone} onChange={set("phone")} className="z-input" type="tel"/>
                </>
              )}
              <input placeholder="Email address" value={f.email} onChange={set("email")} className="z-input" type="email" required/>
              {mode!=="forgot"&&(
                <div className="relative">
                  <input placeholder="Password" value={f.password} onChange={set("password")} className="z-input pr-12" type={show?"text":"password"} required minLength={6}/>
                  <button type="button" onClick={()=>setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-z-600">{show?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
                </div>
              )}
              {mode==="login"&&<div className="text-right"><button type="button" onClick={()=>setMode("forgot")} className="text-z-600 text-sm font-medium hover:underline">Forgot password?</button></div>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 gap-2">
                {loading?<Loader2 className="w-4 h-4 animate-spin"/>:null}
                {mode==="login"?"Sign In":mode==="signup"?"Create Account":"Send Reset Link"}
              </button>
            </form>

            {mode!=="forgot"&&(
              <>
                <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-gray-200"/><span className="text-gray-400 text-xs font-medium">or</span><div className="flex-1 h-px bg-gray-200"/></div>
                <button onClick={google} disabled={loading} className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-2xl py-3.5 text-sm font-semibold text-gray-700 hover:border-z-300 hover:bg-z-50 transition-all">
                  <Chrome className="w-5 h-5 text-blue-500"/>Continue with Google
                </button>
              </>
            )}

            <p className="text-center text-sm text-gray-500 mt-6">
              {mode==="login"?<>No account? <button onClick={()=>setMode("signup")} className="text-z-600 font-semibold hover:underline">Sign up</button></>
              :mode==="signup"?<>Have an account? <button onClick={()=>setMode("login")} className="text-z-600 font-semibold hover:underline">Sign in</button></>
              :<><button onClick={()=>setMode("login")} className="text-z-600 font-semibold hover:underline">Back to sign in</button></>}
            </p>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">By continuing you agree to Zaiqaa's Terms & Privacy Policy</p>
        </div>
      </div>
      <div id="recaptcha-container"/>
    </div>
  );
}
