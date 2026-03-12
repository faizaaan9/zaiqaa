import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], restaurantId: null, restaurantName: "", appliedCoupon: null,
      addItem: (item, restaurantId, restaurantName) => {
        const { restaurantId: cur, items } = get();
        if (cur && cur !== restaurantId) { set({ items: [{ ...item, quantity: 1 }], restaurantId, restaurantName }); return "cleared"; }
        const ex = items.find(i => i.id === item.id);
        if (ex) set({ items: items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) });
        else set({ items: [...items, { ...item, quantity: 1 }], restaurantId, restaurantName });
        return "added";
      },
      removeItem: (id) => {
        const { items } = get();
        const ex = items.find(i => i.id === id);
        if (!ex) return;
        const newItems = ex.quantity === 1 ? items.filter(i => i.id !== id) : items.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
        set({ items: newItems, restaurantId: newItems.length === 0 ? null : get().restaurantId });
      },
      deleteItem: (id) => { const n = get().items.filter(i => i.id !== id); set({ items: n, restaurantId: n.length === 0 ? null : get().restaurantId }); },
      clearCart: () => set({ items: [], restaurantId: null, restaurantName: "", appliedCoupon: null }),
      applyCoupon: (c) => set({ appliedCoupon: c }),
      removeCoupon: () => set({ appliedCoupon: null }),
      getSubtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      getTotalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      getDeliveryFee: () => get().getSubtotal() > 299 ? 0 : 40,
      getTaxes: () => Math.round(get().getSubtotal() * 0.05),
      getDiscount: () => { const c = get().appliedCoupon; if (!c) return 0; const s = get().getSubtotal(); return c.type === "percent" ? Math.min((s * c.value) / 100, c.maxDiscount || Infinity) : c.value; },
      getGrandTotal: () => get().getSubtotal() + get().getDeliveryFee() + get().getTaxes() - get().getDiscount(),
    }),
    { name: "zaiqaa-cart" }
  )
);
