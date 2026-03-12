import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AuthPage          from "./Pages/AuthPage";
import HomePage          from "./Pages/HomePage";
import RestaurantPage    from "./Pages/RestaurantPage";
import CartPage          from "./Pages/CartPage";
import CheckoutPage      from "./Pages/CheckoutPage";
import OrdersPage        from "./Pages/OrdersPage";
import OrderTrackingPage from "./Pages/OrderTrackingPage";
import FavouritesPage    from "./Pages/FavouritesPage";
import ProfilePage       from "./Pages/ProfilePage";
import SearchPage        from "./Pages/SearchPage";
import CategoryPage      from "./Pages/CategoryPage";
import AppLayout         from "./Components/layout/AppLayout";

function Guard({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}
function Public({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Public><AuthPage /></Public>} />
      <Route path="/" element={<Guard><AppLayout /></Guard>}>
        <Route index                   element={<HomePage />} />
        <Route path="search"           element={<SearchPage />} />
        <Route path="category/:slug"   element={<CategoryPage />} />
        <Route path="restaurant/:id"   element={<RestaurantPage />} />
        <Route path="cart"             element={<CartPage />} />
        <Route path="checkout"         element={<CheckoutPage />} />
        <Route path="orders"           element={<OrdersPage />} />
        <Route path="orders/:id/track" element={<OrderTrackingPage />} />
        <Route path="favourites"       element={<FavouritesPage />} />
        <Route path="profile"          element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
