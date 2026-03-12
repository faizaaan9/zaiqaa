import { useState, useEffect } from "react";
const BANNERS = [
  { bg:"from-z-800 to-z-950", emoji:"🎉", title:"50% OFF First Order", sub:"Use code: ZAIQAA50" },
  { bg:"from-amber-700 to-orange-800", emoji:"🥩", title:"Kebab Festival Week", sub:"Exclusive deals daily" },
  { bg:"from-emerald-700 to-z-800", emoji:"🌿", title:"Healthy Ramadan Boxes", sub:"Nutritious meals" },
  { bg:"from-rose-700 to-pink-800", emoji:"🍮", title:"Mithai & Desserts", sub:"Authentic sweets" },
];
export default function BannerSlider() {
  const [cur, setCur] = useState(0);
  useEffect(() => { const t = setInterval(() => setCur(c => (c+1)%BANNERS.length), 4500); return () => clearInterval(t); }, []);
  return (
    <div className="relative rounded-2xl overflow-hidden h-36 shadow-md">
      {BANNERS.map((b,i) => (
        <div key={i} className={`absolute inset-0 bg-gradient-to-r ${b.bg} px-6 py-5 flex items-center justify-between transition-all duration-700 ${i===cur?"opacity-100 translate-x-0":"opacity-0 translate-x-full"}`}>
          <div>
            <p className="font-display text-xl font-bold text-white">{b.title}</p>
            <p className="text-white/70 text-sm mt-1">{b.sub}</p>
            <button className="mt-3 bg-gold-500 text-z-950 text-xs font-bold px-4 py-1.5 rounded-full">Claim Now</button>
          </div>
          <span className="text-6xl">{b.emoji}</span>
        </div>
      ))}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {BANNERS.map((_,i) => <button key={i} onClick={()=>setCur(i)} className={`h-1.5 rounded-full transition-all ${i===cur?"w-6 bg-gold-400":"w-1.5 bg-white/30"}`}/>)}
      </div>
    </div>
  );
}
