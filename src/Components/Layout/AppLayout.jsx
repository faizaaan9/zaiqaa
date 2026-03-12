import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCartStore } from "../../store/cartStore";
import ZaiqaaLogo from "../ZaiqaaLogo";
import { Home, Search, ShoppingBag, Heart, User, ChevronDown, LogOut, MapPin } from "lucide-react";

const NAV = [
  { to:"/", label:"Home", icon:Home, exact:true },
  { to:"/search", label:"Search", icon:Search },
  { to:"/orders", label:"Orders", icon:ShoppingBag },
  { to:"/favourites", label:"Saved", icon:Heart },
  { to:"/profile", label:"Profile", icon:User },
];

export default function AppLayout() {
  const { user, userProfile, logout } = useAuth();
  const cartCount = useCartStore(s => s.getTotalItems());
  const navigate = useNavigate();
  const [dd, setDd] = useState(false);
  const avatar = (userProfile?.name || user?.displayName || "Z")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-[#f5f7f5] flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <NavLink to="/"><ZaiqaaLogo size="sm" dark/></NavLink>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({to,label,icon:Icon,exact}) => (
              <NavLink key={to} to={to} end={exact} className={({isActive})=>`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive?"bg-z-50 text-z-700 border border-z-100":"text-gray-600 hover:bg-gray-50"}`}>
                <Icon className="w-4 h-4"/>{label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <NavLink to="/cart" className="relative p-2 rounded-xl hover:bg-z-50 transition-colors">
              <ShoppingBag className="w-5 h-5 text-z-700"/>
              {cartCount>0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-z-950 text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </NavLink>
            <div className="relative">
              <button onClick={()=>setDd(!dd)} className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-z-50">
                <div className="w-8 h-8 bg-gradient-to-br from-z-500 to-z-800 rounded-xl flex items-center justify-center text-white text-sm font-bold">{avatar}</div>
                <span className="hidden sm:block text-sm font-semibold text-z-800 max-w-[80px] truncate">{userProfile?.name?.split(" ")[0]||"You"}</span>
                <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block"/>
              </button>
              {dd && (<>
                <div className="fixed inset-0 z-40" onClick={()=>setDd(false)}/>
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="p-4 bg-z-50 border-b border-z-100">
                    <p className="font-semibold text-z-900 text-sm">{userProfile?.name||user?.displayName}</p>
                    <p className="text-z-600 text-xs truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    {[["My Profile","/profile"],["My Orders","/orders"],["Favourites","/favourites"]].map(([l,p])=>(
                      <button key={p} onClick={()=>{navigate(p);setDd(false);}} className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-z-50">{l}</button>
                    ))}
                    <hr className="my-1 border-gray-100"/>
                    <button onClick={async()=>{await logout();navigate("/auth");}} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50">
                      <LogOut className="w-4 h-4"/>Logout
                    </button>
                  </div>
                </div>
              </>)}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6"><Outlet/></main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
        <div className="flex items-center justify-around h-16">
          {[...NAV,{to:"/cart",label:"Cart",icon:ShoppingBag}].map(({to,label,icon:Icon,exact})=>(
            <NavLink key={to} to={to} end={exact} className={({isActive})=>`relative flex flex-col items-center gap-0.5 px-3 py-2 ${isActive?"text-z-600":"text-gray-400"}`}>
              {({isActive})=>(
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${isActive?"scale-110":""}`}/>
                    {label==="Cart"&&cartCount>0&&<span className="absolute -top-2 -right-2 w-4 h-4 bg-gold-500 text-z-950 text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
                  </div>
                  <span className="text-[10px] font-medium">{label}</span>
                  {isActive&&<span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gold-500 rounded-full"/>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
      <div className="md:hidden h-16"/>
    </div>
  );
}
