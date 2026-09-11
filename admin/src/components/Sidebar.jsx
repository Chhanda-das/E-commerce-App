import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const links = [
        { to: "/", label: "Dashboard", icon: "⌂", end: true },
        { to: "/add", label: "Add Items", icon: "+" },
        { to: "/list", label: "List Items", icon: "☷", end: true },
        { to: "/list/footwear", label: "Footwear", icon: "◈", child: true },
        { to: "/orders", label: "Orders", icon: "▣" },
    ];

    return (
        <aside className="w-[76px] md:w-[220px] lg:w-[240px] shrink-0 bg-white border-r border-gray-200">
            <nav className="sticky top-[81px] p-3 md:p-4 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                            [
                                "flex items-center gap-3 rounded-xl px-3 md:px-4 py-3 text-sm transition",
                                link.child ? "md:ml-5" : "",
                                isActive
                                    ? "bg-[#f4f0e8] text-black font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-black",
                            ].join(" ")
                        }
                    >
                        <span className="w-5 text-center text-lg shrink-0">
                            {link.icon}
                        </span>

                        <span className="hidden md:block">
                            {link.label}
                        </span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
