import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { User, Mail, Phone, ShoppingBag, Heart, LogOut, ChevronRight, Edit2, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, userProfile, logout, refreshProfile } = useAuth(); const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userProfile?.name||""); const [phone, setPhone] = useState(userProfile?.phone||"");
  const avatar = (userProfile?.name||user?.displayName||"Z")[0].toUpperCase();

  async function save() {
    await updateDoc(doc(db,"users",user.uid),{name,phone});
    await refreshProfile(); setEditing(false); toast.success("Profile updated! ✅");
  }

  const LINKS = [[ShoppingBag,"My Orders","/orders"],[Heart,"Favourites","/favourites"]];

  return (
    <div className="max-w-2xl mx-auto page-enter">
      <h1 className="font-display text-2xl font-bold text-z-900 mb-6">My Profile</h1>
      <div className="card p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-z-500 to-z-900 rounded-2xl flex items-center justify-center font-display text-2xl font-bold text-gold-400">{avatar}</div>
          <div className="flex-1">
            <p className="font-display text-xl font-bold text-z-900">{userProfile?.name||user?.displayName}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
          <button onClick={()=>setEditing(!editing)} className="p-2 rounded-xl hover:bg-z-50 text-z-600">{editing?<Check className="w-5 h-5"/>:<Edit2 className="w-5 h-5"/>}</button>
        </div>
        {editing?(
          <div className="space-y-3">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="z-input text-sm"/>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone number" className="z-input text-sm" type="tel"/>
            <button onClick={save} className="btn-primary w-full py-3">Save Changes</button>
          </div>
        ):(
          <div className="space-y-3">
            {[["Name",userProfile?.name||user?.displayName,User],["Email",user?.email,Mail],["Phone",userProfile?.phone||"Not added",Phone]].map(([l,v,Icon])=>(
              <div key={l} className="flex items-center gap-3 p-3 bg-z-50 rounded-xl">
                <Icon className="w-4 h-4 text-z-500 flex-shrink-0"/>
                <div><p className="text-xs text-gray-400">{l}</p><p className="font-semibold text-z-900 text-sm">{v}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card mb-4 overflow-hidden">
        {LINKS.map(([Icon,label,path])=>(
          <button key={path} onClick={()=>navigate(path)} className="w-full flex items-center gap-4 p-4 hover:bg-z-50 transition-colors border-b last:border-0 border-gray-50">
            <div className="w-10 h-10 bg-z-50 rounded-xl flex items-center justify-center"><Icon className="w-5 h-5 text-z-600"/></div>
            <span className="font-semibold text-z-800 text-sm flex-1 text-left">{label}</span>
            <ChevronRight className="w-4 h-4 text-gray-300"/>
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <button onClick={async()=>{await logout();navigate("/auth");}} className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center"><LogOut className="w-5 h-5 text-red-500"/></div>
          <span className="font-semibold text-red-500 text-sm flex-1 text-left">Logout</span>
        </button>
      </div>

      <p className="text-center text-xs text-gray-300 mt-6">Zaiqaa v1.0 · Taste the Authentic 🌿</p>
    </div>
  );
}
