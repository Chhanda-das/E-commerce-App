import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const TrackOrder = () => {

    const { orderId } = useParams();

    const {
        backendUrl,
        token,
        currency
    } = useContext(ShopContext);

    const authToken = token || localStorage.getItem("token");

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // LOAD ORDER
    // ==========================================

    const loadOrder = async () => {

        try {

            if (!authToken) {

                setError("Please login to view your order.");

                setLoading(false);

                return;
            }


            const response = await fetch(
                `${backendUrl}/api/order/userorders`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        token: authToken
                    },
                    credentials: "include"
                }
            );


            const data = await response.json();

            console.log(
                "TRACK ORDER RESPONSE:",
                data
            );


            if (!data.success) {

                setError(
                    data.message ||
                    "Unable to load order."
                );

                setLoading(false);

                return;
            }


            // ==================================
            // FIND CURRENT ORDER
            // ==================================

            const foundOrder =
                (data.orders || []).find(
                    (item) =>
                        item._id === orderId
                );


            if (!foundOrder) {

                setError("Order not found.");

            } else {

                setOrder(foundOrder);

            }

        } catch (error) {

            console.log(
                "TRACK ORDER ERROR:",
                error
            );

            setError(
                "Something went wrong while loading your order."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOAD WHEN PAGE OPENS
    // ==========================================

    useEffect(() => {
    loadOrder();
}, [token, orderId]);

    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // ==========================================
    // GET STATUS STEP
    // ==========================================

    const getStatusStep = (status) => {

        switch (status) {

            case "Order Placed":
                return 1;

            case "Packing":
                return 2;

            case "Shipped":
                return 3;

            case "Out for Delivery":
                return 4;

            case "Delivered":
                return 5;

            default:
                return 1;

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="border-t pt-16">

                <Title
                    text1={"TRACK"}
                    text2={"ORDER"}
                />

                <p className="mt-8 text-gray-500">
                    Loading order...
                </p>

            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div className="border-t pt-16">

                <Title
                    text1={"TRACK"}
                    text2={"ORDER"}
                />

                <p className="mt-8 text-red-500">
                    {error}
                </p>

            </div>
        );

    }


    // ==========================================
    // NO ORDER
    // ==========================================

    if (!order) {

        return (
            <div className="border-t pt-16">

                <Title
                    text1={"TRACK"}
                    text2={"ORDER"}
                />

                <p className="mt-8 text-gray-500">
                    Order not found.
                </p>

            </div>
        );

    }


    // ==========================================
    // CURRENT STATUS
    // ==========================================

    const currentStep =
        getStatusStep(order.status);


    // ==========================================
    // STATUS DATA
    // ==========================================

    const statusSteps = [

        {
            title: "Order Placed",
            description: "Your order has been placed successfully."
        },

        {
            title: "Packing",
            description: "Your order is being packed."
        },

        {
            title: "Shipped",
            description: "Your order has been shipped."
        },

        {
            title: "Out for Delivery",
            description: "Your order is out for delivery."
        },

        {
            title: "Delivered",
            description: "Your order has been delivered."
        }

    ];


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="border-t pt-16 pb-20">

            {/* ==================================
                TITLE
            ================================== */}

            <div className="text-2xl mb-10">

                <Title
                    text1={"TRACK"}
                    text2={"ORDER"}
                />

            </div>


            {/* ==================================
                ORDER INFORMATION
            ================================== */}

            <div className="border p-5 mb-10">

                <div className="flex flex-col gap-3">

                    <p className="text-sm text-gray-500">
                        Order ID
                    </p>

                    <p className="font-medium break-all">
                        {order._id}
                    </p>


                    <p className="text-sm text-gray-500 mt-2">
                        Order Date
                    </p>

                    <p>
                        {formatDate(order.date)}
                    </p>


                    <p className="text-sm text-gray-500 mt-2">
                        Payment Method
                    </p>

                    <p>
                        {order.paymentMethod ||
                            "Cash on Delivery"}
                    </p>


                    <p className="text-sm text-gray-500 mt-2">
                        Payment Status
                    </p>

                    <p
                        className={
                            order.payment
                                ? "text-green-500"
                                : "text-gray-500"
                        }
                    >
                        {order.payment
                            ? "Paid"
                            : "Pending"}
                    </p>


                    <p className="text-sm text-gray-500 mt-2">
                        Total Amount
                    </p>

                    <p className="font-medium">
                        {currency}
                        {order.amount}
                    </p>

                </div>

            </div>


            {/* ==================================
                ORDER ITEMS
            ================================== */}

            <div className="mb-12">

                <h3 className="text-lg font-medium mb-5">
                    Order Items
                </h3>


                <div className="flex flex-col gap-5">

                    {order.items?.map(
                        (item, index) => (

                            <div
                                key={index}
                                className="
                                    flex
                                    items-center
                                    gap-5
                                    border-b
                                    pb-5
                                "
                            >

                                <img
                                    src={item.image?.[0]}
                                    alt={item.name}
                                    className="
                                        w-20
                                        h-24
                                        object-cover
                                    "
                                />


                                <div>

                                    <p className="font-medium">
                                        {item.name}
                                    </p>


                                    <p className="text-gray-500 mt-1">
                                        Price: {currency}
                                        {item.price}
                                    </p>


                                    <p className="text-gray-500">
                                        Quantity: {item.quantity}
                                    </p>


                                    <p className="text-gray-500">
                                        Size: {item.size}
                                    </p>

                                </div>

                            </div>

                        )
                    )}

                </div>

            </div>


            {/* ==================================
                TRACKING STATUS
            ================================== */}

            <div>

                <h3 className="text-lg font-medium mb-8">
                    Order Status
                </h3>


                <div className="flex flex-col">

                    {statusSteps.map(
                        (step, index) => {

                            const stepNumber =
                                index + 1;

                            const completed =
                                stepNumber <= currentStep;

                            const isLast =
                                index ===
                                statusSteps.length - 1;


                            return (

                                <div
                                    key={step.title}
                                    className="
                                        flex
                                        items-start
                                    "
                                >

                                    {/* ==================================
                                        LEFT TIMELINE
                                    ================================== */}

                                    <div className="
                                        flex
                                        flex-col
                                        items-center
                                        mr-5
                                    ">

                                        <div
                                            className={`
                                                w-5
                                                h-5
                                                rounded-full
                                                border
                                                flex
                                                items-center
                                                justify-center
                                                ${completed
                                                    ? "bg-green-500 border-green-500"
                                                    : "bg-white border-gray-300"
                                                }
                                            `}
                                        >

                                            {completed && (

                                                <div
                                                    className="
                                                        w-2
                                                        h-2
                                                        bg-white
                                                        rounded-full
                                                    "
                                                ></div>

                                            )}

                                        </div>


                                        {!isLast && (

                                            <div
                                                className={`
                                                    w-[2px]
                                                    h-16
                                                    ${stepNumber <
                                                        currentStep
                                                        ? "bg-green-500"
                                                        : "bg-gray-300"
                                                    }
                                                `}
                                            ></div>

                                        )}

                                    </div>


                                    {/* ==================================
                                        STATUS INFORMATION
                                    ================================== */}

                                    <div
                                        className="
                                            pb-8
                                            flex-1
                                        "
                                    >

                                        <p
                                            className={`
                                                font-medium
                                                ${completed
                                                    ? "text-gray-800"
                                                    : "text-gray-400"
                                                }
                                            `}
                                        >
                                            {step.title}
                                        </p>


                                        <p
                                            className={`
                                                text-sm
                                                mt-1
                                                ${completed
                                                    ? "text-gray-500"
                                                    : "text-gray-400"
                                                }
                                            `}
                                        >
                                            {step.description}
                                        </p>


                                        {stepNumber ===
                                            currentStep && (

                                                <p className="
                                                text-sm
                                                text-green-500
                                                mt-2
                                                font-medium
                                            ">
                                                    Current Status
                                                </p>

                                            )}

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            </div>

        </div>

    );

};

export default TrackOrder;