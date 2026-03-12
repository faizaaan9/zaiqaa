import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Clock, TrendingUp } from "lucide-react";
const POPULAR = ["Biryani","Kebab","Curry","Haleem","Paratha","Nihari","Desserts","Chai","Seekh Kebab","Mutton"];
const RECENT = ["Chicken Biryani","Butter Naan","Mutton Kebab"];
const ITEMS = [
  {id:"r1",name:"Al-Baik Biryani House",tag:"Restaurant",sub:"Biryani · 25-35 min",image:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=60"},
  {id:"r2",name:"Chicken Dum Biryani",tag:"Dish",sub:"at Al-Baik · ₹299",image:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=60"},
  {id:"r3",name:"Zafrani Kebab & Grill",tag:"Restaurant",sub:"Kebabs · 30-40 min",image:"https://images.unsplash.com/photo-1544025162-d76694265947?w=60"},
];
export default function SearchPage() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const results = q.length>1?ITEMS.filter(i=>i.name.toLowerCase().includes(q.toLowerCase())):[];
  return (
    <div className="max-w-2xl mx-auto page-enter">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-z-500"/>
        <input value={q} onChange={e=>setQ(e.target.value)} autoFocus placeholder="Search biryani, kebab, restaurants..." className="w-full border-2 border-gray-200 focus:border-z-600 rounded-2xl py-4 pl-12 pr-12 outline-none font-semibold text-sm bg-white shadow-sm"/>
        {q&&<button onClick={()=>setQ("")} className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"><X className="w-3.5 h-3.5 text-gray-500"/></button>}
      </div>
      {results.length>0&&<div className="card overflow-hidden mb-6">{results.map((item,i)=>(
        <div key={item.id} onClick={()=>navigate(`/restaurant/${item.id}`)} className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-z-50 transition-colors ${i!==results.length-1?"border-b border-gray-50":""}`}>
          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover"/>
          <div className="flex-1"><p className="font-semibold text-z-900 text-sm">{item.name}</p><p className="text-gray-400 text-xs">{item.sub}</p></div>
          <span className="text-xs bg-z-50 text-z-700 px-2 py-0.5 rounded-full font-semibold">{item.tag}</span>
        </div>
      ))}</div>}
      {q.length>1&&!results.length&&<div className="text-center py-12"><p className="text-5xl mb-3">🔍</p><p className="font-display font-bold text-z-900">No results for "{q}"</p></div>}
      {!q&&<>
        <div className="mb-6"><div className="flex items-center gap-2 mb-3"><Clock className="w-4 h-4 text-gray-400"/><h2 className="font-display font-semibold text-z-700">Recent</h2></div>
          <div className="flex flex-wrap gap-2">{RECENT.map(r=><button key={r} onClick={()=>setQ(r)} className="bg-white border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-full hover:border-z-300 transition-all">{r}</button>)}</div>
        </div>
        <div><div className="flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4 text-z-600"/><h2 className="font-display font-semibold text-z-700">Popular</h2></div>
          <div className="flex flex-wrap gap-2">{POPULAR.map(p=><button key={p} onClick={()=>setQ(p)} className="bg-z-50 border border-z-100 text-z-700 text-sm px-4 py-2 rounded-full hover:bg-z-100 font-semibold">🔥 {p}</button>)}</div>
        </div>
      </>}
    </div>
  );
}
