import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import RestaurantCard from "../components/cards/RestaurantCard";
import { DEMO_RESTAURANTS } from "./HomePage";
const NAMES = {biryani:"Biryani 🍚",kebab:"Kebab 🥩",curry:"Curry 🍛",healthy:"Healthy 🥗",mithai:"Mithai 🍮",chinese:"Chinese 🥡","south-indian":"South Indian 🫙",breakfast:"Breakfast 🥞",desserts:"Desserts 🍰",beverages:"Beverages ☕"};
export default function CategoryPage() {
  const {slug} = useParams(); const navigate = useNavigate();
  return (
    <div className="page-enter">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>navigate(-1)} className="p-2 rounded-xl hover:bg-z-50"><ArrowLeft className="w-5 h-5 text-z-800"/></button>
        <h1 className="font-display text-2xl font-bold text-z-900">{NAMES[slug]||slug}</h1>
        <span className="text-gray-400 text-sm">({DEMO_RESTAURANTS.length})</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{DEMO_RESTAURANTS.map(r=><RestaurantCard key={r.id} restaurant={r}/>)}</div>
    </div>
  );
}
