import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AuthPage          from "./pages/AuthPage";
import HomePage          from "./pages/HomePage";
import RestaurantPage    from "./pages/RestaurantPage";
import CartPage          from "./pages/CartPage";
import CheckoutPage      from "./pages/CheckoutPage";
import OrdersPage        from "./pages/OrdersPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import FavouritesPage    from "./pages/FavouritesPage";
import ProfilePage       from "./pages/ProfilePage";
import SearchPage        from "./pages/SearchPage";
import CategoryPage      from "./pages/CategoryPage";
import AppLayout         from "./components/layout/AppLayout";

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
