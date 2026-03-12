import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { Clock, ChevronRight, Loader2, ShoppingBag } from "lucide-react";
import { format } from "date-fns";

const COLORS = { placed:"bg-blue-100 text-blue-700", confirmed:"bg-purple-100 text-purple-700", preparing:"bg-amber-100 text-amber-700", out_for_delivery:"bg-z-100 text-z-700", delivered:"bg-green-100 text-green-700", cancelled:"bg-red-100 text-red-700" };
const LABELS = { placed:"Order Placed", confirmed:"Confirmed", preparing:"Preparing", out_for_delivery:"Out for Delivery", delivered:"Delivered", cancelled:"Cancelled" };

export default function OrdersPage() {
  const { user } = useAuth(); const navigate = useNavigate();
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db,"orders"), where("userId","==",user.uid), orderBy("createdAt","desc"));
    return onSnapshot(q, snap => { setOrders(snap.docs.map(d=>({id:d.id,...d.data()}))); setLoading(false); }, ()=>setLoading(false));
  }, [user.uid]);

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-6 h-6 animate-spin text-z-600"/></div>;
  if (!orders.length) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center page-enter">
      <div className="text-7xl mb-4">📦</div>
      <h2 className="font-display text-2xl font-bold text-z-900 mb-2">No orders yet</h2>
      <p className="text-gray-500 mb-6">Your order history will appear here</p>
      <button onClick={()=>navigate("/")} className="btn-primary flex items-center gap-2"><ShoppingBag className="w-4 h-4"/>Order Now</button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto page-enter">
      <h1 className="font-display text-2xl font-bold text-z-900 mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => {
          const active = !["delivered","cancelled"].includes(order.status);
          return (
            <div key={order.id} onClick={()=>navigate(`/orders/${order.id}/track`)} className="card card-hover p-5 cursor-pointer group">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-display font-bold text-z-900">{order.restaurantName}</h3>
                  <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3"/>{order.createdAt?.toDate?format(order.createdAt.toDate(),"dd MMM yyyy · h:mm a"):"Recently"}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${COLORS[order.status]||"bg-gray-100 text-gray-600"}`}>{LABELS[order.status]||order.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{order.items?.map(i=>`${i.quantity}× ${i.name}`).slice(0,2).join(", ")}{order.items?.length>2&&` +${order.items.length-2} more`}</p>
                  <p className="font-display font-bold text-z-900 mt-1">₹{order.total}</p>
                </div>
                <div className="flex items-center gap-2">
                  {active&&<span className="text-xs bg-z-50 text-z-600 px-2.5 py-1 rounded-full font-semibold animate-pulse">Live Track</span>}
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-z-600 transition-colors"/>
                </div>
              </div>
              {active&&(
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-z-600 rounded-full transition-all" style={{width:`${(["placed","confirmed","preparing","out_for_delivery","delivered"].indexOf(order.status)+1)*20}%`}}/>
                  </div>
                  <span className="text-xs text-z-600 font-semibold">{order.estimatedDelivery||"30-40 min"}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
