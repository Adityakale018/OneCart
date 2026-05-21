import React, { useContext, useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Registration from './pages/Registration'
import Login from './pages/Login'
import Home from "./pages/Home";
import Nav from './components/Nav';
import { userDatacontext } from './context/UserContext';
import Collections from './pages/Collections';
import About from './pages/About';
import Product from './pages/Product';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Order from './pages/Order';
import Ai from './components/Ai';
import SharedCart from './pages/SharedCart';
import SplitCheckout from './pages/SplitCheckout';
import SplashScreen from './components/SplashScreen';
import ScrollToTop from './components/ScrollToTop';

/* ─── Protected Route wrapper ────────────────────────────────────── */
function Protected({ children }) {
    const { userData, isAuthLoading } = useContext(userDatacontext);
    const location = useLocation();

    if (isAuthLoading) {
        return (
            <div className="w-full min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#ff3f6c]/30 border-t-[#ff3f6c] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!userData) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    return children;
}

function App() {
    const { userData, isAuthLoading } = useContext(userDatacontext);
    const location = useLocation();

    // Splash: show while loading, then trigger exit animation for 650ms
    const [splashDone, setSplashDone] = useState(false);
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        let isCancelled = false;
        let t;

        // Force splash to exit after 2.3 seconds (max 3 seconds total loading time including 650ms animation)
        const fallbackTimer = setTimeout(() => {
            if (!isCancelled) {
                setSplashDone(true);
                t = setTimeout(() => setShowSplash(false), 650);
            }
        }, 2350);

        if (!isAuthLoading) {
            clearTimeout(fallbackTimer);
            setSplashDone(true);
            t = setTimeout(() => setShowSplash(false), 650);
        }

        return () => {
            isCancelled = true;
            clearTimeout(fallbackTimer);
            if (t) clearTimeout(t);
        };
    }, [isAuthLoading]);

    return (
        <>
            {/* Splash screen overlay */}
            {showSplash && <SplashScreen onDone={splashDone} />}

            {/* Scroll to top on every route change */}
            <ScrollToTop />

            {userData && <Nav />}
            <Routes>
                {/* Auth routes (redirect to home if logged in) */}
                <Route
                    path="/login"
                    element={userData ? <Navigate to={location.state?.from || "/"} replace /> : <Login />}
                />
                <Route
                    path="/signup"
                    element={userData ? <Navigate to={location.state?.from || "/"} replace /> : <Registration />}
                />

                {/* Protected routes */}
                <Route path="/" element={<Protected><Home /></Protected>} />
                <Route path="/about" element={<Protected><About /></Protected>} />
                <Route path="/collection" element={<Protected><Collections /></Protected>} />
                <Route path="/product" element={<Protected><Product /></Protected>} />
                <Route path="/contact" element={<Protected><Contact /></Protected>} />
                <Route path="/productdetail/:productId" element={<Protected><ProductDetail /></Protected>} />
                <Route path="/cart" element={<Protected><Cart /></Protected>} />
                <Route path="/placeorder" element={<Protected><PlaceOrder /></Protected>} />
                <Route path="/order" element={<Protected><Order /></Protected>} />

                {/* ── NEW: Shared Cart & Split Payment ── */}
                <Route path="/shared-cart/:cartId" element={<Protected><SharedCart /></Protected>} />
                <Route path="/split-checkout/:cartId" element={<Protected><SplitCheckout /></Protected>} />
            </Routes>

            {/* Global AI assistant (only when logged in) */}
            {userData && <Ai />}
        </>
    );
}

export default App;
