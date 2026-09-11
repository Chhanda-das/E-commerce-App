import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { assets } from "../assets/assets";

const Navbar = () => {
    const { logout } = useContext(AdminContext);

    return (
        <header className="h-[81px] bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <img
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                    src={assets.logo}
                    alt="Store logo"
                />

                <div className="hidden sm:block">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
                        Store Management
                    </p>
                    <p className="font-semibold text-gray-900">
                        Admin Panel
                    </p>
                </div>
            </div>

            <button
                onClick={logout}
                className="px-4 sm:px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
            >
                Logout
            </button>
        </header>
    );
};

export default Navbar;
