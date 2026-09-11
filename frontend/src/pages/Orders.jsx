import React, {
    useContext,
    useEffect,
    useState
} from "react";

import axios from "axios";

import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const Orders = () => {

    const {
        backendUrl,
        token,
        currency,
        navigate
    } = useContext(ShopContext);

    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);


    // ==========================================
    // LOAD ORDERS
    // ==========================================

    const loadOrderData = async () => {

        try {

            setLoading(true);

            // Get latest token
            const currentToken =
                token || localStorage.getItem("token");

            console.log(
                "ORDERS TOKEN:",
                currentToken ? "FOUND" : "NOT FOUND"
            );

            console.log(
                "BACKEND URL:",
                backendUrl
            );


            // ======================================
            // NO TOKEN
            // ======================================

            if (!currentToken) {

                setOrderData([]);

                setLoading(false);

                return;
            }


            // ======================================
            // GET ORDERS
            // ======================================

            const response = await axios.post(

                backendUrl + "/api/order/userorders",

                {},

                {
                    headers: {
                        token: currentToken
                    }
                }

            );


            console.log(
                "USER ORDERS RESPONSE:",
                response.data
            );


            // ======================================
            // SUCCESS
            // ======================================

            if (response.data.success) {

                let allOrdersItem = [];


                // ==================================
                // LOOP ORDERS
                // ==================================

                response.data.orders.forEach(
                    (order) => {

                        // ==================================
                        // LOOP ITEMS
                        // ==================================

                        if (
                            Array.isArray(order.items)
                        ) {

                            order.items.forEach(
                                (item) => {

                                    const orderItem = {
                                        ...item,

                                        status:
                                            order.status ||
                                            "Order Placed",

                                        payment:
                                            order.payment ||
                                            false,

                                        paymentMethod:
                                            order.paymentMethod ||
                                            "COD",

                                        date:
                                            order.date,

                                        orderId:
                                            order._id,

                                        amount:
                                            order.amount
                                    };


                                    allOrdersItem.push(
                                        orderItem
                                    );

                                }
                            );

                        }

                    }
                );


                console.log(
                    "ALL ORDER ITEMS:",
                    allOrdersItem
                );


                setOrderData(
                    allOrdersItem
                );

            } else {

                console.error(
                    "ORDER API ERROR:",
                    response.data.message
                );

                setOrderData([]);

            }

        } catch (error) {

            console.error(
                "LOAD ORDERS ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            setOrderData([]);

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // LOAD WHEN PAGE OPENS
    // ==========================================

    useEffect(() => {

        loadOrderData();

    }, [token, backendUrl]);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="border-t pt-16">

                <div className="text-2xl mb-8">

                    <Title
                        text1="MY"
                        text2="ORDERS"
                    />

                </div>

                <p className="text-gray-500">

                    Loading orders...

                </p>

            </div>

        );

    }


    // ==========================================
    // NOT LOGIN
    // ==========================================

    const currentToken =
        token || localStorage.getItem("token");

    if (!currentToken) {

        return (

            <div className="border-t pt-16">

                <div className="text-2xl mb-8">

                    <Title
                        text1="MY"
                        text2="ORDERS"
                    />

                </div>

                <p className="text-gray-500 mb-5">

                    Please login to view your orders.

                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/login")
                    }
                    className="
                        bg-black
                        text-white
                        px-6
                        py-3
                        text-sm
                    "
                >

                    LOGIN

                </button>

            </div>

        );

    }


    // ==========================================
    // NO ORDERS
    // ==========================================

    if (
        !orderData ||
        orderData.length === 0
    ) {

        return (

            <div className="border-t pt-16">

                <div className="text-2xl mb-8">

                    <Title
                        text1="MY"
                        text2="ORDERS"
                    />

                </div>

                <p className="text-gray-500 mb-5">

                    No orders found.

                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/collection")
                    }
                    className="
                        bg-black
                        text-white
                        px-6
                        py-3
                        text-sm
                    "
                >

                    CONTINUE SHOPPING

                </button>

            </div>

        );

    }


    // ==========================================
    // ORDERS
    // ==========================================

    return (

        <div className="border-t pt-16">

            {/* TITLE */}

            <div className="text-2xl mb-10">

                <Title
                    text1="MY"
                    text2="ORDERS"
                />

            </div>


            {/* ORDER ITEMS */}

            <div>

                {orderData.map(
                    (item, index) => (

                        <div
                            key={
                                `${item.orderId}-${index}`
                            }
                            className="
                                py-6
                                border-t
                                border-b
                                text-gray-700
                                flex
                                flex-col
                                md:flex-row
                                md:items-center
                                md:justify-between
                                gap-6
                            "
                        >

                            {/* ==========================
                                PRODUCT
                            ========================== */}

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-6
                                "
                            >

                                {/* IMAGE */}

                                <img
                                    className="
                                        w-16
                                        sm:w-20
                                        h-20
                                        object-cover
                                    "
                                    src={
                                        item.image?.[0] ||
                                        item.image
                                    }
                                    alt={
                                        item.name ||
                                        "Product"
                                    }
                                />


                                {/* DETAILS */}

                                <div>

                                    <p
                                        className="
                                            sm:text-base
                                            font-medium
                                        "
                                    >

                                        {
                                            item.name ||
                                            "Product"
                                        }

                                    </p>


                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            gap-4
                                            mt-2
                                            text-base
                                        "
                                    >

                                        <p>

                                            {currency}

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
                                                "N/A"
                                            }

                                        </p>

                                    </div>


                                    {/* DATE */}

                                    <p className="mt-2">

                                        Date:

                                        <span
                                            className="
                                                text-gray-400
                                            "
                                        >

                                            {" "}

                                            {
                                                item.date
                                                    ? new Date(
                                                        item.date
                                                    ).toLocaleDateString(
                                                        "en-GB"
                                                    )
                                                    : "N/A"
                                            }

                                        </span>

                                    </p>


                                    {/* PAYMENT */}

                                    <p className="mt-2">

                                        Payment:

                                        <span
                                            className="
                                                text-gray-400
                                            "
                                        >

                                            {" "}

                                            {
                                                item.paymentMethod ||
                                                "COD"
                                            }

                                        </span>

                                    </p>


                                    {/* PAYMENT STATUS */}

                                    <p className="mt-2">

                                        Payment Status:

                                        <span
                                            className={
                                                item.payment
                                                    ? "text-green-500"
                                                    : "text-gray-400"
                                            }
                                        >

                                            {" "}

                                            {
                                                item.payment
                                                    ? "Paid"
                                                    : "Pending"
                                            }

                                        </span>

                                    </p>

                                </div>

                            </div>


                            {/* ==========================
                                STATUS + TRACK
                            ========================== */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    sm:flex-row
                                    sm:items-center
                                    gap-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <p
                                        className="
                                            min-w-2
                                            h-2
                                            rounded-full
                                            bg-green-500
                                        "
                                    ></p>

                                    <p
                                        className="
                                            text-sm
                                            md:text-base
                                        "
                                    >

                                        {
                                            item.status ||
                                            "Order Placed"
                                        }

                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/track-order/${item.orderId}`
                                        )
                                    }
                                    className="
                                        border
                                        px-5
                                        py-2
                                        text-sm
                                        font-medium
                                        rounded-sm
                                        hover:bg-gray-50
                                    "
                                >

                                    Track Order

                                </button>

                            </div>

                        </div>

                    )
                )}

            </div>

        </div>

    );

};

export default Orders;