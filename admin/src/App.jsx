import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";

import Dashboard from "./pages/Dashboard";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Footwear from "./pages/Footwear";

const App = () => {
    const { token, loading } = useContext(AdminContext);

    if (loading && !token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-500">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    if (!token) {
        return <Login />;
    }

    return (
        <div className="min-h-screen bg-[#fafafa] text-gray-900">
            <Navbar />

            <div className="flex min-h-[calc(100vh-81px)]">
                <Sidebar />

                <main className="flex-1 min-w-0 overflow-x-hidden">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/add" element={<Add />} />
                        <Route path="/list" element={<List token={token} />} />
                        <Route path="/list/footwear" element={<Footwear />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default App;
