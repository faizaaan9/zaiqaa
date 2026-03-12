import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuth } from "../context/AuthContext";
import { collection, addDoc, doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import toast from "react-hot-toast";
import { MapPin, CreditCard, Smartphone, Banknote, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

const PAY = [
  {id:"upi",label:"UPI",icon:Smartphone,sub:"GPay, PhonePe, BHIM"},
  {id:"card",label:"Credit / Debit Card",icon:CreditCard,sub:"All major cards"},
  {id:"cod",label:"Cash on Delivery",icon:Banknote,sub:"Pay when order arrives"},
  {id:"wallet",label:"Zaiqaa Wallet",icon:CheckCircle,sub:"Balance: ₹0.00"},
];

export default function CheckoutPage() {
  const navigate = useNavigate(); const {user,userProfile} = useAuth(); const store = useCartStore();
  const {items,restaurantId,restaurantName,clearCart} = store;
  const [addr,setAddr] = useState({name:userProfile?.name||"",phone:userProfile?.phone||"",flat:"",area:"",landmark:"",pincode:"",city:"Mysore",type:"Home"});
  const [pay,setPay] = useState("upi"); const [upi,setUpi] = useState(""); const [placing,setPlacing] = useState(false); const [step,setStep] = useState(1);
  const A = f => e => setAddr({...addr,[f]:e.target.value});

  async function placeOrder() {
    if (!addr.flat||!addr.area||!addr.pincode) return toast.error("Fill complete address");
    if (pay==="upi"&&!upi) return toast.error("Enter UPI ID");
    setPlacing(true);
    try {
      const ref = await addDoc(collection(db,"orders"),{userId:user.uid,restaurantId,restaurantName,items,address:addr,paymentMethod:pay,status:"placed",subtotal:store.getSubtotal(),deliveryFee:store.getDeliveryFee(),taxes:store.getTaxes(),discount:store.getDiscount(),total:store.getGrandTotal(),createdAt:serverTimestamp(),estimatedDelivery:"30-40 min",deliveryPartner:{name:"Raju Kumar",phone:"+91 9876543210",rating:4.8}});
      await updateDoc(doc(db,"users",user.uid),{totalOrders:increment(1)});
      clearCart(); toast.success("Order placed! Bismillah 🌿"); navigate(`/orders/${ref.id}/track`);
    } catch { toast.error("Failed to place order"); }
    finally { setPlacing(false); }
  }

  return (
    <div className="max-w-2xl mx-auto page-enter">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>navigate(-1)} className="p-2 rounded-xl hover:bg-z-50"><ArrowLeft className="w-5 h-5 text-z-800"/></button>
        <h1 className="font-display text-2xl font-bold text-z-900">Checkout</h1>
      </div>
      <div className="flex items-center gap-3 mb-8">
        {["Delivery Address","Payment"].map((s,i)=>(
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step>i+1?"bg-z-600 text-white":step===i+1?"bg-gold-500 text-z-950":"bg-gray-200 text-gray-400"}`}>{step>i+1?"✓":i+1}</div>
            <span className={`text-sm font-medium ${step===i+1?"text-z-900":"text-gray-400"}`}>{s}</span>
            {i===0&&<div className="w-8 h-px bg-gray-200"/>}
          </div>
        ))}
      </div>

      {step===1&&(
        <div className="space-y-4 page-enter">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-5"><MapPin className="w-5 h-5 text-z-600"/><h2 className="font-display font-bold text-z-900">Delivery Address</h2></div>
            <div className="flex gap-2 mb-4">
              {["Home","Work","Other"].map(t=><button key={t} onClick={()=>setAddr({...addr,type:t})} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${addr.type===t?"border-z-600 bg-z-50 text-z-700":"border-gray-200 text-gray-500"}`}>{t==="Home"?"🏠":t==="Work"?"💼":"📍"} {t}</button>)}
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3"><input placeholder="Your name" value={addr.name} onChange={A("name")} className="z-input text-sm"/><input placeholder="Phone" value={addr.phone} onChange={A("phone")} className="z-input text-sm" type="tel"/></div>
              <input placeholder="Flat / House / Building" value={addr.flat} onChange={A("flat")} className="z-input text-sm" required/>
              <input placeholder="Area / Street / Locality" value={addr.area} onChange={A("area")} className="z-input text-sm" required/>
              <input placeholder="Landmark (optional)" value={addr.landmark} onChange={A("landmark")} className="z-input text-sm"/>
              <div className="grid grid-cols-2 gap-3"><input placeholder="Pincode" value={addr.pincode} onChange={A("pincode")} className="z-input text-sm" maxLength={6} required/><input placeholder="City" value={addr.city} onChange={A("city")} className="z-input text-sm"/></div>
            </div>
          </div>
          <button onClick={()=>{if(!addr.flat||!addr.area||!addr.pincode)return toast.error("Fill required fields");setStep(2);}} className="btn-primary w-full py-4">Continue to Payment</button>
        </div>
      )}

      {step===2&&(
        <div className="space-y-4 page-enter">
          <div className="bg-z-50 border border-z-100 rounded-2xl p-4 flex gap-3">
            <MapPin className="w-5 h-5 text-z-600 flex-shrink-0"/>
            <div><p className="font-semibold text-z-900 text-sm">{addr.name} · {addr.type}</p><p className="text-gray-600 text-sm">{addr.flat}, {addr.area}</p><p className="text-gray-400 text-xs">{addr.city} - {addr.pincode}</p></div>
            <button onClick={()=>setStep(1)} className="ml-auto text-z-600 text-sm font-semibold hover:underline">Edit</button>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-5"><CreditCard className="w-5 h-5 text-z-600"/><h2 className="font-display font-bold text-z-900">Payment</h2></div>
            <div className="space-y-3">{PAY.map(({id,label,icon:Icon,sub})=>(
              <div key={id}>
                <button onClick={()=>setPay(id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${pay===id?"border-z-600 bg-z-50":"border-gray-100 hover:border-gray-200"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pay===id?"bg-z-700":"bg-gray-100"}`}><Icon className={`w-5 h-5 ${pay===id?"text-white":"text-gray-500"}`}/></div>
                  <div className="text-left flex-1"><p className="font-semibold text-z-900 text-sm">{label}</p><p className="text-gray-400 text-xs">{sub}</p></div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${pay===id?"border-z-600":"border-gray-300"}`}>{pay===id&&<div className="w-2.5 h-2.5 rounded-full bg-z-600"/>}</div>
                </button>
                {pay==="upi"&&id==="upi"&&<div className="mt-2"><input value={upi} onChange={e=>setUpi(e.target.value)} placeholder="yourname@upi" className="z-input text-sm"/></div>}
              </div>
            ))}</div>
          </div>
          <div className="card p-4">
            <h3 className="font-display font-bold text-z-900 mb-3">Summary</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{store.getSubtotal()}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{store.getDeliveryFee()===0?<span className="text-z-600 font-semibold">FREE</span>:`₹${store.getDeliveryFee()}`}</span></div>
              <div className="flex justify-between"><span>Taxes</span><span>₹{store.getTaxes()}</span></div>
              {store.getDiscount()>0&&<div className="flex justify-between text-z-600 font-semibold"><span>Discount</span><span>-₹{store.getDiscount()}</span></div>}
              <div className="flex justify-between font-display font-bold text-z-900 text-base pt-2 border-t border-gray-100"><span>Total</span><span>₹{store.getGrandTotal()}</span></div>
            </div>
          </div>
          <button onClick={placeOrder} disabled={placing} className="btn-gold w-full py-4 flex items-center justify-center gap-2">
            {placing?<><Loader2 className="w-4 h-4 animate-spin"/>Placing...</>:`Place Order · ₹${store.getGrandTotal()}`}
          </button>
          <p className="text-center text-xs text-gray-400">🔒 Secure checkout</p>
        </div>
      )}
    </div>
  );
}
