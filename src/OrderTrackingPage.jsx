import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { MapPin, Phone, Star, CheckCircle, Package, Bike, Home, ArrowLeft } from "lucide-react";

const STAGES = [
  {key:"placed",label:"Order Placed",icon:CheckCircle,desc:"Your order has been received"},
  {key:"confirmed",label:"Confirmed",icon:Package,desc:"Restaurant confirmed your order"},
  {key:"preparing",label:"Preparing",emoji:"🍳",desc:"Kitchen is cooking your food"},
  {key:"out_for_delivery",label:"Out for Delivery",icon:Bike,desc:"Delivery partner on the way"},
  {key:"delivered",label:"Delivered",icon:Home,desc:"Enjoy your meal! 🎉"},
];

const DEMO = { restaurantName:"Al-Baik Biryani House", status:"preparing", estimatedDelivery:"30-40 min", total:487, items:[{name:"Chicken Dum Biryani",quantity:2,price:299},{name:"Sweet Lassi",quantity:1,price:79}], deliveryPartner:{name:"Raju Kumar",phone:"+91 9876543210",rating:4.8}, address:{flat:"12, MG Road",area:"Mysore",city:"Mysore",pincode:"570001"}, paymentMethod:"upi" };

export default function OrderTrackingPage() {
  const {id} = useParams(); const navigate = useNavigate();
  const [order, setOrder] = useState(DEMO); const [eta, setEta] = useState(32);

  useEffect(() => {
    const unsub = onSnapshot(doc(db,"orders",id), snap => { if (snap.exists()) setOrder({...DEMO,...snap.data()}); }, ()=>{});
    const t = setInterval(()=>setEta(e=>e>0?e-1:0), 60000);
    return ()=>{ unsub(); clearInterval(t); };
  }, [id]);

  const cur = STAGES.findIndex(s=>s.key===order.status);

  return (
    <div className="max-w-xl mx-auto page-enter">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>navigate("/orders")} className="p-2 rounded-xl hover:bg-z-50"><ArrowLeft className="w-5 h-5 text-z-800"/></button>
        <h1 className="font-display text-xl font-bold text-z-900">Track Order</h1>
        <span className="ml-auto text-xs text-gray-400 font-mono">#{id?.slice(0,8).toUpperCase()}</span>
      </div>

      <div className="relative bg-gradient-to-br from-z-800 to-z-950 rounded-3xl p-6 text-white mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"/>
        <div className="relative"><p className="text-z-300 text-sm">Arriving in</p><p className="font-display text-5xl font-bold mt-1 text-gold-400">{eta} <span className="text-xl text-white">min</span></p><p className="text-z-300 text-sm mt-2">{order.restaurantName} → Your door 🛵</p></div>
      </div>

      <div className="card overflow-hidden mb-6 h-44 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-z-50 to-emerald-50 flex items-center justify-center">
          <div className="text-center"><div className="text-5xl mb-2 animate-bounce">🛵</div><p className="text-z-600 text-sm font-semibold">Live Tracking</p><p className="text-gray-400 text-xs mt-1">Connect Google Maps to enable</p></div>
        </div>
        <div className="absolute top-3 left-3 bg-white rounded-xl px-3 py-1.5 shadow flex items-center gap-2 text-xs font-semibold text-z-700"><div className="w-2 h-2 bg-z-500 rounded-full animate-pulse"/>Live</div>
      </div>

      <div className="card p-5 mb-6">
        <h2 className="font-display font-bold text-z-900 mb-5">Order Status</h2>
        <div className="space-y-1">{STAGES.map((stage,i)=>{
          const done=i<cur, active=i===cur, upcoming=i>cur;
          return (
            <div key={stage.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${done?"bg-z-600":active?"bg-gold-500 shadow-lg":""} ${upcoming?"bg-gray-100":""}`}>
                  {stage.emoji?<span className="text-lg">{stage.emoji}</span>:<stage.icon className={`w-5 h-5 ${done||active?done?"text-white":"text-z-950":"text-gray-400"}`}/>}
                </div>
                {i<STAGES.length-1&&<div className={`w-0.5 h-8 mt-1 rounded-full ${done?"bg-z-400":"bg-gray-100"}`}/>}
              </div>
              <div className="pb-6 flex-1">
                <p className={`font-semibold text-sm ${upcoming?"text-gray-400":"text-z-900"}`}>{stage.label}{active&&<span className="ml-2 text-gold-600 text-xs">● Now</span>}</p>
                <p className={`text-xs mt-0.5 ${upcoming?"text-gray-300":"text-gray-500"}`}>{stage.desc}</p>
              </div>
            </div>
          );
        })}</div>
      </div>

      {order.deliveryPartner&&cur>=3&&(
        <div className="card p-5 mb-6">
          <h2 className="font-display font-bold text-z-900 mb-4">Delivery Partner</h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-z-500 to-z-800 rounded-2xl flex items-center justify-center text-2xl">👨‍💼</div>
            <div className="flex-1"><p className="font-bold text-z-900">{order.deliveryPartner.name}</p><div className="flex items-center gap-1 mt-0.5"><Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500"/><span className="text-sm text-gray-400">{order.deliveryPartner.rating}</span></div></div>
            <a href={`tel:${order.deliveryPartner.phone}`} className="w-11 h-11 bg-z-600 rounded-2xl flex items-center justify-center hover:bg-z-700 transition-colors"><Phone className="w-5 h-5 text-white"/></a>
          </div>
        </div>
      )}

      <div className="card p-5">
        <h2 className="font-display font-bold text-z-900 mb-4">Order Summary</h2>
        <div className="space-y-2 mb-4">{order.items?.map((item,i)=>(
          <div key={i} className="flex justify-between text-sm text-gray-600"><span>{item.quantity}× {item.name}</span><span className="font-semibold text-z-900">₹{item.price*item.quantity}</span>
          </div>
        ))}</div>
        <div className="flex justify-between font-display font-bold text-z-900 pt-3 border-t border-gray-100"><span>Total Paid</span><span>₹{order.total}</span></div>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400"><MapPin className="w-3 h-3"/><span>{order.address?.flat}, {order.address?.city}</span></div>
      </div>

      {order.status==="delivered"&&(
        <div className="mt-6 bg-z-50 border border-z-100 rounded-2xl p-5 text-center">
          <p className="text-3xl mb-2">🎉</p><p className="font-display font-bold text-z-900">Order Delivered!</p>
          <p className="text-z-600 text-sm mt-1">Shukran! Hope you enjoyed your meal 🌿</p>
          <button onClick={()=>navigate("/")} className="btn-primary mt-4">Order Again</button>
        </div>
      )}
    </div>
  );
}
