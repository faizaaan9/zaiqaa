import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search, ChevronRight, Flame, TrendingUp } from "lucide-react";
import RestaurantCard from "../components/cards/RestaurantCard";
import CategoryCard from "../components/cards/CategoryCard";
import BannerSlider from "../components/BannerSlider";

const CATEGORIES = [
  {id:"biryani",name:"Biryani",emoji:"🍚",color:"from-amber-500 to-orange-600"},
  {id:"kebab",name:"Kebab",emoji:"🥩",color:"from-red-500 to-rose-600"},
  {id:"curry",name:"Curry",emoji:"🍛",color:"from-orange-500 to-amber-600"},
  {id:"healthy",name:"Healthy",emoji:"🥗",color:"from-green-500 to-emerald-600"},
  {id:"mithai",name:"Mithai",emoji:"🍮",color:"from-pink-400 to-rose-500"},
  {id:"chinese",name:"Chinese",emoji:"🥡",color:"from-red-600 to-orange-700"},
  {id:"south-indian",name:"South Indian",emoji:"🫙",color:"from-emerald-500 to-teal-600"},
  {id:"breakfast",name:"Breakfast",emoji:"🥞",color:"from-yellow-400 to-amber-500"},
  {id:"desserts",name:"Desserts",emoji:"🍰",color:"from-pink-500 to-fuchsia-500"},
  {id:"beverages",name:"Beverages",emoji:"☕",color:"from-amber-700 to-yellow-800"},
];

export const DEMO_RESTAURANTS = [
  {id:"r1",name:"Al-Baik Biryani House",cuisine:"Biryani, Andhra, Hyderabadi",rating:4.7,deliveryTime:"25-35 min",deliveryFee:0,minOrder:149,image:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500",tags:["Bestseller","Halal"],isVeg:false,isOpen:true,discount:"20% OFF",isHalal:true},
  {id:"r2",name:"Zafrani Kebab & Grill",cuisine:"Kebabs, Mughlai, Grills",rating:4.5,deliveryTime:"30-40 min",deliveryFee:40,minOrder:199,image:"https://images.unsplash.com/photo-1544025162-d76694265947?w=500",tags:["Halal","Popular"],isVeg:false,isOpen:true,discount:"",isHalal:true},
  {id:"r3",name:"Shree Sagar (CTR)",cuisine:"South Indian, Breakfast",rating:4.4,deliveryTime:"20-30 min",deliveryFee:30,minOrder:99,image:"https://images.unsplash.com/photo-1630383249896-424e482df921?w=500",tags:["Pure Veg"],isVeg:true,isOpen:true,discount:"10% OFF",isHalal:false},
  {id:"r4",name:"Royal Darbar",cuisine:"North Indian, Mughlai",rating:4.3,deliveryTime:"35-45 min",deliveryFee:0,minOrder:249,image:"https://images.unsplash.com/photo-1631515242808-497c3fbd2945?w=500",tags:["FREE Delivery","Halal"],isVeg:false,isOpen:true,discount:"",isHalal:true},
  {id:"r5",name:"Garden Fresh",cuisine:"Salads, Healthy, Bowls",rating:4.2,deliveryTime:"20-30 min",deliveryFee:0,minOrder:149,image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500",tags:["Pure Veg","Healthy"],isVeg:true,isOpen:true,discount:"",isHalal:false},
  {id:"r6",name:"Bombay Mithai House",cuisine:"Sweets, Desserts, Snacks",rating:4.6,deliveryTime:"15-25 min",deliveryFee:20,minOrder:99,image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",tags:["Pure Veg"],isVeg:true,isOpen:false,discount:"",isHalal:false},
];

const FILTERS = ["All","Pure Veg","Non-Veg","Halal Only","Fast Food"];

export default function HomePage() {
  const { userProfile, user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const firstName = (userProfile?.name||user?.displayName||"there").split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour<12?"Good Morning":hour<17?"Good Afternoon":"Good Evening";
  const filtered = filter==="All"?DEMO_RESTAURANTS:filter==="Pure Veg"?DEMO_RESTAURANTS.filter(r=>r.isVeg):filter==="Halal Only"?DEMO_RESTAURANTS.filter(r=>r.isHalal):filter==="Non-Veg"?DEMO_RESTAURANTS.filter(r=>!r.isVeg):DEMO_RESTAURANTS;

  return (
    <div className="space-y-8 page-enter pb-4">
      <div className="relative bg-gradient-to-br from-z-800 via-z-700 to-z-900 rounded-3xl p-6 md:p-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 opacity-10 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl"/>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-z-300 text-sm">{greeting}, 👋</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mt-1">{firstName}!<br/><span className="text-gold-400 italic text-2xl">What are you craving?</span></h1>
            </div>
            <div className="text-5xl hidden sm:block">🫕</div>
          </div>
          <button onClick={()=>navigate("/search")} className="mt-6 w-full bg-white/95 rounded-2xl px-5 py-4 flex items-center gap-3 text-gray-400 text-sm hover:shadow-lg transition-all">
            <Search className="w-4 h-4 text-z-600"/>Search biryani, kebab, restaurants...
          </button>
          <div className="flex gap-3 mt-4">
            {[["🌿","100% Halal"],["🚀","30 min avg"],["🍽️","500+ dishes"]].map(([e,l])=>(
              <div key={l} className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5 text-xs text-white/80 font-medium"><span>{e}</span>{l}</div>
            ))}
          </div>
        </div>
      </div>

      <BannerSlider/>

      <section>
        <div className="flex items-center justify-between mb-5">
          <div><div className="gold-line mb-2"/><h2 className="font-display text-xl font-bold text-z-900">What's on your mind?</h2></div>
          <button onClick={()=>navigate("/search")} className="text-z-600 text-sm font-semibold flex items-center gap-1 hover:underline">See all<ChevronRight className="w-3.5 h-3.5"/></button>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
          {CATEGORIES.map(cat=><CategoryCard key={cat.id} category={cat} onClick={()=>navigate(`/category/${cat.id}`)}/>)}
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {FILTERS.map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${filter===f?"bg-z-700 text-white border-z-700":"bg-white text-gray-600 border-gray-200 hover:border-z-300"}`}>{f}</button>
        ))}
      </div>

      <section>
        <div className="flex items-center gap-2 mb-5"><Flame className="w-5 h-5 text-gold-500"/><h2 className="font-display text-xl font-bold text-z-900">Trending Near You</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{filtered.slice(0,3).map(r=><RestaurantCard key={r.id} restaurant={r}/>)}</div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-5"><TrendingUp className="w-5 h-5 text-z-600"/><h2 className="font-display text-xl font-bold text-z-900">All Restaurants</h2><span className="text-gray-400 text-sm">({filtered.length})</span></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{filtered.map(r=><RestaurantCard key={r.id} restaurant={r}/>)}</div>
      </section>
    </div>
  );
}
