import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Heart } from "lucide-react";
import RestaurantCard from "../components/cards/RestaurantCard";
import { DEMO_RESTAURANTS } from "./HomePage";

export default function FavouritesPage() {
  const { userProfile } = useAuth(); const navigate = useNavigate();
  const favs = DEMO_RESTAURANTS.filter(r => userProfile?.favourites?.includes(r.id));
  return (
    <div className="page-enter max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6"><Heart className="w-6 h-6 fill-red-400 text-red-400"/><h1 className="font-display text-2xl font-bold text-z-900">Favourites</h1></div>
      {!favs.length?(
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="text-7xl mb-4">🤍</div>
          <h2 className="font-display text-xl font-bold text-z-900 mb-2">No favourites yet</h2>
          <p className="text-gray-400 mb-6 text-sm">Tap ❤️ on any restaurant to save it here</p>
          <button onClick={()=>navigate("/")} className="btn-primary">Browse Restaurants</button>
        </div>
      ):(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{favs.map(r=><RestaurantCard key={r.id} restaurant={r}/>)}</div>
      )}
    </div>
  );
}
