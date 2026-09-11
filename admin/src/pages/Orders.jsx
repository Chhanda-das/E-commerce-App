import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { assets } from "../assets/assets";

const Orders = () => {
    // ======================================================
    // ADMIN CONTEXT
    // ======================================================

    const {
        orders,
        token,
        updateOrderStatus,
    } = useContext(AdminContext);

    // ======================================================
    // FORMAT DATE
    // ======================================================

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // ======================================================
    // STATUS HANDLER
    // ======================================================

    const statusHandler = async (event, orderId) => {
        try {
            const status = event.target.value;

            console.log("UPDATE ORDER STATUS:", {
                orderId,
                status,
            });

            const success = await updateOrderStatus(
                orderId,
                status
            );

            if (success) {
                console.log("STATUS UPDATED SUCCESSFULLY");
            }
        } catch (error) {
            console.error(
                "STATUS HANDLER ERROR:",
                error
            );
        }
    };

    // ======================================================
    // NO ADMIN TOKEN
    // ======================================================

    if (!token) {
        return (
            <div className="p-5">
                <h3
                    className="
                        text-xl
                        font-medium
                        mb-3
                    "
                >
                    Orders
                </h3>

                <div
                    className="
                        border
                        border-gray-300
                        p-5
                        text-gray-600
                    "
                >
                    Please login as admin to view orders.
                </div>
            </div>
        );
    }

    // ======================================================
    // PAGE
    // ======================================================

    return (
        <div className="p-5">

            {/* ==================================================
                TITLE
            ================================================== */}

            <h3
                className="
                    text-2xl
                    font-medium
                    mb-5
                "
            >
                Orders
            </h3>

            {/* ==================================================
                NO ORDERS
            ================================================== */}

            {!orders || orders.length === 0 ? (
                <div
                    className="
                        border
                        border-gray-300
                        p-5
                        text-gray-600
                    "
                >
                    No orders found.
                </div>
            ) : (

                /* ==================================================
                    ORDERS LIST
                ================================================== */

                <div
                    className="
                        flex
                        flex-col
                        gap-5
                    "
                >
                    {orders.map((order, orderIndex) => (
                        <div
                            key={
                                order._id ||
                                orderIndex
                            }
                            className="
                                border
                                border-gray-300
                                p-5
                                bg-white
                            "
                        >

                            {/* ==================================================
                                ORDER HEADER
                            ================================================== */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    md:flex-row
                                    md:items-center
                                    md:justify-between
                                    gap-4
                                    mb-5
                                "
                            >

                                {/* ORDER INFORMATION */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <img
                                        src={
                                            assets.parcel_icon
                                        }
                                        className="w-10"
                                        alt="Order"
                                    />

                                    <div>
                                        <p
                                            className="
                                                font-medium
                                            "
                                        >
                                            Order #
                                            {" "}
                                            {String(
                                                order._id || ""
                                            ).slice(-8)}
                                        </p>

                                        <p
                                            className="
                                                text-gray-500
                                                text-sm
                                            "
                                        >
                                            Date:
                                            {" "}
                                            {formatDate(
                                                order.date
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* ORDER AMOUNT */}

                                <p
                                    className="
                                        font-medium
                                        text-lg
                                    "
                                >
                                    ₹{order.amount || 0}
                                </p>
                            </div>

                            {/* ==================================================
                                ORDER ITEMS
                            ================================================== */}

                            <div
                                className="
                                    border-t
                                    border-gray-200
                                    pt-4
                                "
                            >
                                <h4
                                    className="
                                        font-medium
                                        mb-3
                                    "
                                >
                                    Order Items
                                </h4>

                                {order.items &&
                                order.items.length > 0 ? (
                                    <div>
                                        {order.items.map(
                                            (
                                                item,
                                                itemIndex
                                            ) => (
                                                <div
                                                    key={
                                                        itemIndex
                                                    }
                                                    className="
                                                        flex
                                                        gap-4
                                                        py-4
                                                        border-b
                                                        border-gray-200
                                                    "
                                                >

                                                    {/* PRODUCT IMAGE */}

                                                    <img
                                                        src={
                                                            item.image?.[0]
                                                        }
                                                        className="
                                                            w-20
                                                            h-20
                                                            object-cover
                                                            border
                                                        "
                                                        alt={
                                                            item.name ||
                                                            "Product"
                                                        }
                                                    />

                                                    {/* PRODUCT DETAILS */}

                                                    <div
                                                        className="
                                                            flex-1
                                                        "
                                                    >
                                                        <p
                                                            className="
                                                                font-medium
                                                            "
                                                        >
                                                            {
                                                                item.name
                                                            }
                                                        </p>

                                                        <div
                                                            className="
                                                                flex
                                                                flex-wrap
                                                                gap-4
                                                                mt-2
                                                                text-sm
                                                                text-gray-600
                                                            "
                                                        >
                                                            <p>
                                                                Price:
                                                                {" "}
                                                                ₹
                                                                {
                                                                    item.price ||
                                                                    0
                                                                }
                                                            </p>

                                                            <p>
                                                                Quantity:
                                                                {" "}
                                                                {
                                                                    item.quantity ||
                                                                    0
                                                                }
                                                            </p>

                                                            <p>
                                                                Size:
                                                                {" "}
                                                                {
                                                                    item.size ||
                                                                    "Free Size"
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p
                                        className="
                                            text-gray-500
                                        "
                                    >
                                        No items found.
                                    </p>
                                )}
                            </div>

                            {/* ==================================================
                                CUSTOMER + DELIVERY
                            ================================================== */}

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    gap-6
                                    mt-5
                                "
                            >

                                {/* CUSTOMER DETAILS */}

                                <div>
                                    <h4
                                        className="
                                            font-medium
                                            mb-2
                                        "
                                    >
                                        Customer Details
                                    </h4>

                                    <p>
                                        {
                                            order.address
                                                ?.firstName
                                        }
                                        {" "}
                                        {
                                            order.address
                                                ?.lastName
                                        }
                                    </p>

                                    <p
                                        className="
                                            text-gray-600
                                            mt-1
                                        "
                                    >
                                        {
                                            order.address
                                                ?.email
                                        }
                                    </p>

                                    <p
                                        className="
                                            text-gray-600
                                            mt-1
                                        "
                                    >
                                        {
                                            order.address
                                                ?.phone
                                        }
                                    </p>
                                </div>

                                {/* DELIVERY ADDRESS */}

                                <div>
                                    <h4
                                        className="
                                            font-medium
                                            mb-2
                                        "
                                    >
                                        Delivery Address
                                    </h4>

                                    <p>
                                        {
                                            order.address
                                                ?.street
                                        }
                                    </p>

                                    <p>
                                        {
                                            order.address
                                                ?.city
                                        }
                                        {", "}
                                        {
                                            order.address
                                                ?.state
                                        }
                                    </p>

                                    <p>
                                        {
                                            order.address
                                                ?.country
                                        }
                                        {" "}
                                        {
                                            order.address
                                                ?.zipcode
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* ==================================================
                                PAYMENT + STATUS
                            ================================================== */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    md:flex-row
                                    md:items-center
                                    md:justify-between
                                    gap-5
                                    mt-5
                                    pt-5
                                    border-t
                                    border-gray-200
                                "
                            >

                                {/* PAYMENT INFORMATION */}

                                <div>
                                    <p>
                                        <span
                                            className="
                                                font-medium
                                            "
                                        >
                                            Payment Method:
                                        </span>
                                        {" "}
                                        {
                                            order.paymentMethod ||
                                            "COD"
                                        }
                                    </p>

                                    <p className="mt-1">
                                        <span
                                            className="
                                                font-medium
                                            "
                                        >
                                            Payment:
                                        </span>
                                        {" "}
                                        {
                                            order.payment
                                                ? "Done"
                                                : "Pending"
                                        }
                                    </p>
                                </div>

                                {/* ORDER STATUS */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <span
                                        className="
                                            font-medium
                                        "
                                    >
                                        Status:
                                    </span>

                                    <select
                                        value={
                                            order.status ||
                                            "Order Placed"
                                        }
                                        onChange={(event) =>
                                            statusHandler(
                                                event,
                                                order._id
                                            )
                                        }
                                        className="
                                            border
                                            border-gray-300
                                            px-3
                                            py-2
                                            outline-none
                                            bg-white
                                        "
                                    >
                                        <option value="Order Placed">
                                            Order Placed
                                        </option>

                                        <option value="Packing">
                                            Packing
                                        </option>

                                        <option value="Shipped">
                                            Shipped
                                        </option>

                                        <option value="Out for delivery">
                                            Out for delivery
                                        </option>

                                        <option value="Delivered">
                                            Delivered
                                        </option>
                                    </select>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;