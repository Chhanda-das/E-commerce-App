import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Product from "./pages/Product";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TrackOrder from "./pages/TrackOrder";
import Verify from "./pages/Verify";


const App = () => {
    return (
        <>
            <Navbar />

            <Routes>

                {/* Home */}
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* Collection */}
                <Route
                    path="/collection"
                    element={<Collection />}
                />

                

                {/* Product */}
                <Route
                    path="/product/:productId"
                    element={<Product />}
                />

                {/* About */}
                <Route
                    path="/about"
                    element={<About />}
                />

                {/* Contact */}
                <Route
                    path="/contact"
                    element={<Contact />}
                />

                {/* Cart */}
                <Route
                    path="/cart"
                    element={<Cart />}
                />

                {/* Place Order */}
                <Route
                    path="/place-order"
                    element={<PlaceOrder />}
                />

                {/* Orders */}
                <Route
                    path="/orders"
                    element={<Orders />}
                />

                {/* Verify */}
                <Route
                    path="/verify"
                    element={<Verify />}
                />

                {/* Track Order */}
                <Route
                    path="/track-order/:orderId"
                    element={<TrackOrder />}
                />

                {/* Profile */}
                <Route
                    path="/profile"
                    element={<Profile />}
                />

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Register */}
                <Route
                    path="/register"
                    element={<Register />}
                />

            </Routes>

            <Footer />
        </>
    );
};

export default App;