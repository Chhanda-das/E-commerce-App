import React, { useContext, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

const Dashboard = () => {
    const { products, orders, loading } = useContext(AdminContext);

    const stats = useMemo(() => {
        const totalRevenue = orders.reduce(
            (sum, order) => sum + Number(order.amount || 0),
            0
        );

        const delivered = orders.filter(
            (order) => order.status === "Delivered"
        ).length;

        const pending = orders.filter(
            (order) =>
                order.status !== "Delivered" &&
                order.status !== "Cancelled"
        ).length;

        return {
            products: products.length,
            orders: orders.length,
            revenue: totalRevenue,
            delivered,
            pending,
        };
    }, [products, orders]);

    const recentOrders = useMemo(() => {
        return [...orders]
            .sort(
                (a, b) =>
                    new Date(b.date || b.createdAt || 0) -
                    new Date(a.date || a.createdAt || 0)
            )
            .slice(0, 5);
    }, [orders]);

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const cards = [
        {
            label: "Total Products",
            value: stats.products,
            icon: "◈",
        },
        {
            label: "Total Orders",
            value: stats.orders,
            icon: "▣",
        },
        {
            label: "Total Revenue",
            value: `₹${stats.revenue.toLocaleString("en-IN")}`,
            icon: "₹",
        },
        {
            label: "Delivered",
            value: stats.delivered,
            icon: "✓",
        },
    ];

    return (
        <section className="p-5 sm:p-7 lg:p-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-2">
                        Overview
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-semibold">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Manage your store from one place.
                    </p>
                </div>

                <div className="text-sm text-gray-500">
                    {loading ? "Updating..." : "Live store data"}
                </div>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                {card.label}
                            </p>
                            <span className="w-9 h-9 rounded-xl bg-[#f4f0e8] flex items-center justify-center">
                                {card.icon}
                            </span>
                        </div>

                        <p className="text-2xl sm:text-3xl font-semibold mt-5">
                            {card.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="px-5 sm:px-6 py-5 border-b flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold">Recent Orders</h2>
                            <p className="text-xs text-gray-400 mt-1">
                                Latest customer orders
                            </p>
                        </div>

                        <NavLink
                            to="/orders"
                            className="text-sm underline underline-offset-4"
                        >
                            View all
                        </NavLink>
                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="py-16 text-center text-gray-500 text-sm">
                            No orders found.
                        </div>
                    ) : (
                        <div className="divide-y">
                            {recentOrders.map((order, index) => (
                                <div
                                    key={order._id || index}
                                    className="px-5 sm:px-6 py-4 flex items-center justify-between gap-4"
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium truncate">
                                            Order #
                                            {String(
                                                order._id || index
                                            ).slice(-8)}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatDate(
                                                order.date ||
                                                    order.createdAt
                                            )}
                                        </p>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <p className="font-medium">
                                            ₹{order.amount || 0}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {order.status || "Order Placed"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <p className="text-xs uppercase tracking-wider text-gray-400">
                            Order Pulse
                        </p>
                        <p className="text-3xl font-semibold mt-3">
                            {stats.pending}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Orders currently in progress
                        </p>

                        <NavLink
                            to="/orders"
                            className="block text-center bg-black text-white rounded-xl py-3 mt-6 text-sm"
                        >
                            Manage Orders
                        </NavLink>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <p className="text-xs uppercase tracking-wider text-gray-400">
                            Quick Actions
                        </p>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <NavLink
                                to="/add"
                                className="border border-gray-200 rounded-xl p-4 text-sm hover:border-black transition"
                            >
                                <span className="block text-xl mb-2">+</span>
                                Add Product
                            </NavLink>

                            <NavLink
                                to="/list"
                                className="border border-gray-200 rounded-xl p-4 text-sm hover:border-black transition"
                            >
                                <span className="block text-xl mb-2">☷</span>
                                Products
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
