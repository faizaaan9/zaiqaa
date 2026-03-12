import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { Plus, Minus, Trash2, ShoppingBag, Tag, ChevronRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const COUPONS = [
  {code:"ZAIQAA50",type:"percent",value:50,maxDiscount:120,minOrder:199,label:"50% OFF upto ₹120"},
  {code:"FREEDEL",type:"flat",value:40,minOrder:149,label:"Free Delivery"},
  {code:"FLAT100",type:"flat",value:100,minOrder:399,label:"Flat ₹100 OFF"},
];

export default function CartPage() {
  const navigate = useNavigate();
  const store = useCartStore();
  const {items,addItem,removeItem,deleteItem,clearCart,applyCoupon,removeCoupon,appliedCoupon,restaurantId,restaurantName} = store;
  const [code, setCode] = useState(""); const [open, setOpen] = useState(false);

  function apply() {
    const c = COUPONS.find(x=>x.code===code.trim().toUpperCase());
    if (!c) return toast.error("Invalid coupon");
    if (store.getSubtotal()<c.minOrder) return toast.error(`Min order ₹${c.minOrder}`);
    applyCoupon(c); toast.success(`${c.label} applied! ✅`); setOpen(false); setCode("");
  }

  if (!items.length) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center page-enter">
      <div className="text-7xl mb-4">🛒</div>
      <h2 className="font-display text-2xl font-bold text-z-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Add delicious food to get started</p>
      <button onClick={()=>navigate("/")} className="btn-primary flex items-center gap-2"><ShoppingBag className="w-4 h-4"/>Browse Restaurants</button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto page-enter">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>navigate(-1)} className="p-2 rounded-xl hover:bg-z-50"><ArrowLeft className="w-5 h-5 text-z-800"/></button>
        <h1 className="font-display text-2xl font-bold text-z-900">Your Cart</h1>
        <button onClick={clearCart} className="ml-auto text-red-400 text-sm flex items-center gap-1 hover:underline"><Trash2 className="w-3.5 h-3.5"/>Clear</button>
      </div>

      <div className="bg-z-50 border border-z-100 rounded-2xl p-4 mb-4 flex items-center gap-3">
        <span className="text-2xl">🏪</span>
        <div><p className="text-xs text-z-500">Ordering from</p><p className="font-display font-bold text-z-900">{restaurantName}</p></div>
        <button onClick={()=>navigate(`/restaurant/${restaurantId}`)} className="ml-auto text-z-600 text-sm font-semibold flex items-center gap-1 hover:underline">Add more<ChevronRight className="w-3.5 h-3.5"/></button>
      </div>

      <div className="card mb-4 overflow-hidden">
        {items.map((item,i)=>(
          <div key={item.id} className={`p-4 flex items-center gap-4 ${i!==items.length-1?"border-b border-gray-50":""}`}>
            <div className="flex-1"><p className="font-semibold text-z-900 text-sm">{item.name}</p><p className="text-z-600 font-bold text-sm">₹{item.price} × {item.quantity}</p></div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 border border-z-200 rounded-xl overflow-hidden bg-z-50">
                <button onClick={()=>removeItem(item.id)} className="p-2 hover:bg-z-100"><Minus className="w-3.5 h-3.5 text-z-700"/></button>
                <span className="font-bold text-sm w-5 text-center text-z-900">{item.quantity}</span>
                <button onClick={()=>addItem(item,restaurantId,restaurantName)} className="p-2 hover:bg-z-100"><Plus className="w-3.5 h-3.5 text-z-700"/></button>
              </div>
              <span className="font-display font-bold text-z-900 w-16 text-right">₹{item.price*item.quantity}</span>
              <button onClick={()=>deleteItem(item.id)} className="p-1.5 text-gray-300 hover:text-red-400"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-4">
        {appliedCoupon?(
          <div className="flex items-center gap-3"><Tag className="w-4 h-4 text-z-600"/>
            <div><p className="font-bold text-z-700 text-sm">{appliedCoupon.code} applied</p><p className="text-z-500 text-xs">{appliedCoupon.label}</p></div>
            <button onClick={removeCoupon} className="ml-auto text-red-400 text-xs hover:underline">Remove</button>
          </div>
        ):(
          <button onClick={()=>setOpen(!open)} className="w-full flex items-center gap-3 text-z-600">
            <Tag className="w-4 h-4"/><span className="font-semibold text-sm">Apply coupon code</span><ChevronRight className="w-4 h-4 ml-auto"/>
          </button>
        )}
        {open&&!appliedCoupon&&(
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex gap-2 mb-4"><input value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter code" className="z-input flex-1 uppercase text-sm"/><button onClick={apply} className="btn-primary px-4 py-2.5 text-sm">Apply</button></div>
            <div className="space-y-2">{COUPONS.map(c=>(
              <button key={c.code} onClick={()=>{setCode(c.code);setTimeout(apply,50);}} className="w-full flex items-center gap-3 border-2 border-dashed border-z-100 rounded-xl p-3 hover:border-z-300 hover:bg-z-50 text-left">
                <span className="bg-z-100 text-z-700 font-bold text-xs px-2 py-1 rounded-lg">{c.code}</span>
                <div><p className="text-sm font-semibold text-z-900">{c.label}</p><p className="text-xs text-gray-400">Min ₹{c.minOrder}</p></div>
              </button>
            ))}</div>
          </div>
        )}
      </div>

      <div className="card p-4 mb-6">
        <h3 className="font-display font-bold text-z-900 mb-4">Bill Details</h3>
        <div className="space-y-2.5 text-sm text-gray-600">
          <div className="flex justify-between"><span>Item total</span><span>₹{store.getSubtotal()}</span></div>
          <div className="flex justify-between"><span>Delivery fee</span><span className={store.getDeliveryFee()===0?"text-z-600 font-semibold":""}>{store.getDeliveryFee()===0?"FREE":`₹${store.getDeliveryFee()}`}</span></div>
          <div className="flex justify-between"><span>Taxes (5%)</span><span>₹{store.getTaxes()}</span></div>
          {store.getDiscount()>0&&<div className="flex justify-between text-z-600 font-semibold"><span>Discount</span><span>-₹{store.getDiscount()}</span></div>}
          <div className="flex justify-between font-display font-bold text-z-900 text-base pt-3 border-t border-gray-100"><span>To Pay</span><span>₹{store.getGrandTotal()}</span></div>
        </div>
        {store.getDeliveryFee()>0&&<p className="text-xs text-z-600 mt-3 bg-z-50 rounded-xl px-3 py-2">💡 Add ₹{299-store.getSubtotal()} more for FREE delivery</p>}
      </div>

      <button onClick={()=>navigate("/checkout")} className="btn-gold w-full flex items-center justify-between px-6 py-4 text-base">
        <span>{items.reduce((s,i)=>s+i.quantity,0)} items</span><span>Proceed to Checkout</span><span>₹{store.getGrandTotal()}</span>
      </button>
    </div>
  );
}
