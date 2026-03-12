import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { Star, Clock, ChevronLeft, Search, Plus, Minus, Flame } from "lucide-react";
import toast from "react-hot-toast";

const R = {id:"r1",name:"Al-Baik Biryani House",cuisine:"Biryani, Andhra, Hyderabadi",rating:4.7,deliveryTime:"25-35 min",deliveryFee:0,image:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900",isHalal:true};
const MENU = [
  {category:"🔥 Bestsellers",items:[
    {id:"m1",name:"Chicken Dum Biryani",price:299,isVeg:false,isBestseller:true,isSpicy:true,desc:"Slow-cooked saffron biryani with raita.",image:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120"},
    {id:"m2",name:"Mutton Biryani",price:349,isVeg:false,isBestseller:true,isSpicy:true,desc:"Tender slow-cooked mutton biryani.",image:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=120"},
  ]},
  {category:"🍚 Biryani",items:[
    {id:"m3",name:"Veg Biryani",price:199,isVeg:true,desc:"Fragrant basmati with vegetables."},
    {id:"m4",name:"Egg Biryani",price:229,isVeg:false,desc:"Classic egg biryani."},
    {id:"m5",name:"Prawn Biryani",price:389,isVeg:false,isSpicy:true,desc:"Coastal prawns with coconut notes."},
  ]},
  {category:"🥘 Curries",items:[
    {id:"m6",name:"Butter Chicken",price:249,isVeg:false,desc:"Rich tomato-butter gravy."},
    {id:"m7",name:"Dal Tadka",price:149,isVeg:true,desc:"Yellow lentils in ghee tadka."},
    {id:"m8",name:"Paneer Tikka Masala",price:219,isVeg:true,desc:"Grilled paneer in spiced gravy."},
  ]},
  {category:"🫓 Breads",items:[
    {id:"m9",name:"Butter Naan",price:49,isVeg:true,desc:"Soft clay oven bread."},
    {id:"m10",name:"Laccha Paratha",price:59,isVeg:true,desc:"Flaky layered bread."},
  ]},
  {category:"🥤 Beverages",items:[
    {id:"m11",name:"Sweet Lassi",price:79,isVeg:true,desc:"Chilled yogurt drink."},
    {id:"m12",name:"Chaas",price:49,isVeg:true,desc:"Spiced buttermilk."},
  ]},
];

export default function RestaurantPage() {
  const {id} = useParams(); const navigate = useNavigate();
  const [q, setQ] = useState(""); const [filter, setFilter] = useState("all");
  const {addItem,removeItem,items,restaurantId,restaurantName} = useCartStore();
  const cartTotal = useCartStore(s=>s.getSubtotal()); const cartCount = useCartStore(s=>s.getTotalItems());
  const qty = (itemId) => items.find(i=>i.id===itemId)?.quantity||0;
  function handleAdd(item) {
    if (restaurantId&&restaurantId!==id) { if (!window.confirm(`Clear cart from "${restaurantName}"?`)) return; }
    addItem(item,id,R.name); toast.success("Added to cart 🛒",{duration:1200});
  }
  const filtered = MENU.map(s=>({...s,items:s.items.filter(it=>{
    const mq=!q||it.name.toLowerCase().includes(q.toLowerCase());
    const mf=filter==="all"||(filter==="veg"&&it.isVeg)||(filter==="nonveg"&&!it.isVeg);
    return mq&&mf;
  })})).filter(s=>s.items.length>0);

  return (
    <div className="page-enter max-w-4xl mx-auto">
      <div className="relative h-56 md:h-72 rounded-3xl overflow-hidden mb-6">
        <img src={R.image} alt={R.name} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-z-950/80 via-black/20 to-transparent"/>
        <button onClick={()=>navigate(-1)} className="absolute top-4 left-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md"><ChevronLeft className="w-5 h-5 text-z-900"/></button>
        {R.isHalal&&<div className="absolute top-4 right-4 bg-z-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl">🌙 Halal Certified</div>}
        <div className="absolute bottom-5 left-5 text-white"><h1 className="font-display text-2xl font-bold">{R.name}</h1><p className="text-white/70 text-sm">{R.cuisine}</p></div>
      </div>

      <div className="card p-4 mb-6 grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center"><div className="flex items-center gap-1"><Star className="w-4 h-4 fill-z-600 text-z-600"/><span className="font-display font-bold text-z-900">{R.rating}</span></div><span className="text-gray-400 text-xs">Rating</span></div>
        <div className="flex flex-col items-center border-x border-gray-100"><div className="flex items-center gap-1"><Clock className="w-4 h-4 text-gold-600"/><span className="font-display font-bold text-z-900">{R.deliveryTime}</span></div><span className="text-gray-400 text-xs">Delivery</span></div>
        <div className="flex flex-col items-center"><span className="font-display font-bold text-z-900">{R.deliveryFee===0?"FREE":`₹${R.deliveryFee}`}</span><span className="text-gray-400 text-xs">Fee</span></div>
      </div>

      <div className="flex gap-3 mb-6 sticky top-[65px] z-30 bg-[#f5f7f5] py-3">
        <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search menu..." className="z-input pl-10"/></div>
        {["all","veg","nonveg"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${filter===f?f==="veg"?"bg-green-600 text-white border-green-600":f==="nonveg"?"bg-red-500 text-white border-red-500":"bg-z-700 text-white border-z-700":"bg-white text-gray-600 border-gray-200"}`}>
            {f==="all"?"All":f==="veg"?"🥦 Veg":"🍗 Non-Veg"}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {filtered.map(section=>(
          <div key={section.category}>
            <h2 className="font-display text-lg font-bold text-z-900 mb-4 pb-2 border-b border-z-100">{section.category}</h2>
            <div className="space-y-3">
              {section.items.map(item=>(
                <div key={item.id} className="card p-4 flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-4 h-4 flex-shrink-0 rounded-sm border-2 flex items-center justify-center ${item.isVeg?"border-green-700":"border-red-600"}`}><span className={`w-1.5 h-1.5 rounded-full ${item.isVeg?"bg-green-700":"bg-red-600"}`}/></span>
                      {item.isBestseller&&<span className="bg-gold-400/20 text-gold-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-gold-400/30">BESTSELLER</span>}
                      {item.isSpicy&&<Flame className="w-3.5 h-3.5 text-red-500"/>}
                    </div>
                    <h3 className="font-semibold text-z-900 text-sm">{item.name}</h3>
                    <p className="font-display font-bold text-z-800 mt-0.5">₹{item.price}</p>
                    {item.desc&&<p className="text-gray-400 text-xs mt-1 line-clamp-2">{item.desc}</p>}
                  </div>
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    {item.image&&<img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover"/>}
                    {qty(item.id)===0?(
                      <button onClick={()=>handleAdd(item)} className="w-20 py-1.5 bg-white border-2 border-z-600 text-z-600 font-bold text-sm rounded-xl hover:bg-z-50 flex items-center justify-center gap-1"><Plus className="w-3.5 h-3.5"/>ADD</button>
                    ):(
                      <div className="flex items-center gap-1 bg-z-700 rounded-xl overflow-hidden">
                        <button onClick={()=>removeItem(item.id)} className="px-2.5 py-1.5 text-white hover:bg-z-800"><Minus className="w-3.5 h-3.5"/></button>
                        <span className="text-white font-bold text-sm w-4 text-center">{qty(item.id)}</span>
                        <button onClick={()=>handleAdd(item)} className="px-2.5 py-1.5 text-white hover:bg-z-800"><Plus className="w-3.5 h-3.5"/></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {cartCount>0&&restaurantId===id&&(
        <div className="fixed bottom-0 md:bottom-4 left-0 right-0 md:max-w-xl md:mx-auto px-4 pb-4 md:pb-0 z-50">
          <button onClick={()=>navigate("/cart")} className="w-full bg-z-700 text-white rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl hover:bg-z-800 active:scale-95 transition-all">
            <div className="bg-z-800 rounded-xl px-2.5 py-1 text-sm font-bold">{cartCount} item{cartCount>1?"s":""}</div>
            <span className="font-display font-bold">View Cart</span>
            <span className="font-bold text-gold-400">₹{cartTotal}</span>
          </button>
        </div>
      )}
    </div>
  );
}
