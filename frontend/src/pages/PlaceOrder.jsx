import React, { useContext, useState } from "react";
import axios from "axios";

import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";

import { toast } from "react-toastify";

const PlaceOrder = () => {

    // ==========================================
    // PAYMENT METHOD
    // ==========================================

    const [method, setMethod] = useState("cod");
    const [loading, setLoading] = useState(false);


    // ==========================================
    // SHOP CONTEXT
    // ==========================================

    const {
        navigate,
        currency,
        delivery_fee,
        getCartAmount,
        cartItems,
        products,
        token,
        backendUrl,
        setCartItems
    } = useContext(ShopContext);


    // ==========================================
    // FORM DATA
    // ==========================================

    const [formData, setFormData] = useState({

        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""

    });


    // ==========================================
    // INPUT CHANGE HANDLER
    // ==========================================

    const onChangeHandler = (event) => {

        const name = event.target.name;
        const value = event.target.value;

        setFormData((data) => ({
            ...data,
            [name]: value
        }));

    };


    // ==========================================
    // RAZORPAY CHECKOUT
    // ==========================================

    const openRazorpayCheckout = async ({
        razorpayOrderId,
        orderId,
        amount,
        currency: razorpayCurrency,
        key
    }) => {

        try {

            // Check Razorpay script
            if (!window.Razorpay) {

                toast.error(
                    "Razorpay failed to load. Please refresh the page."
                );

                setLoading(false);

                return;

            }


            // ======================================
            // RAZORPAY OPTIONS
            // ======================================

            const options = {

                key: key,

                amount: amount,

                currency: razorpayCurrency || "INR",

                name: "Forever",

                description: "E-commerce Order",

                order_id: razorpayOrderId,


                // ==================================
                // CUSTOMER INFORMATION
                // ==================================

                prefill: {

                    name:
                        `${formData.firstName} ${formData.lastName}`.trim(),

                    email: formData.email,

                    contact: formData.phone

                },


                // ==================================
                // THEME
                // ==================================

                theme: {

                    color: "#000000"

                },


                // ==================================
                // PAYMENT SUCCESS
                // ==================================

                handler: async function (paymentResponse) {

                    try {

                        console.log(
                            "RAZORPAY PAYMENT RESPONSE:",
                            paymentResponse
                        );


                        // ==================================
                        // VERIFY PAYMENT WITH BACKEND
                        // ==================================

                        const verifyResponse =
                            await axios.post(

                                backendUrl +
                                "/api/order/verify-razorpay",

                                {

                                    razorpay_order_id:
                                        paymentResponse.razorpay_order_id,

                                    razorpay_payment_id:
                                        paymentResponse.razorpay_payment_id,

                                    razorpay_signature:
                                        paymentResponse.razorpay_signature,

                                    orderId: orderId

                                },

                                {

                                    headers: {

                                        token:
                                            token ||
                                            localStorage.getItem("token")

                                    }

                                }

                            );


                        console.log(
                            "RAZORPAY VERIFY RESPONSE:",
                            verifyResponse.data
                        );


                        // ==================================
                        // PAYMENT VERIFIED
                        // ==================================

                        if (verifyResponse.data.success) {

                            toast.success(
                                "Payment successful! Order placed."
                            );


                            // Clear cart
                            setCartItems({});


                            // Go to orders page
                            navigate("/orders");

                        } else {

                            toast.error(
                                verifyResponse.data.message ||
                                "Payment verification failed"
                            );

                        }


                    } catch (error) {

                        console.log(
                            "RAZORPAY VERIFICATION ERROR:",
                            error
                        );

                        console.log(
                            "VERIFY SERVER RESPONSE:",
                            error.response?.data
                        );


                        toast.error(

                            error.response?.data?.message ||

                            "Payment verification failed"

                        );

                    } finally {

                        setLoading(false);

                    }

                },


                // ==================================
                // PAYMENT MODAL DISMISSED
                // ==================================

                modal: {

                    ondismiss: function () {

                        console.log(
                            "RAZORPAY CHECKOUT CLOSED"
                        );

                        setLoading(false);

                        toast.info(
                            "Payment cancelled"
                        );

                    }

                }

            };


            console.log(
                "RAZORPAY CHECKOUT OPTIONS:",
                options
            );


            // ======================================
            // CREATE RAZORPAY INSTANCE
            // ======================================

            const razorpay =
                new window.Razorpay(options);


            // ======================================
            // PAYMENT FAILED
            // ======================================

            razorpay.on(
                "payment.failed",
                function (response) {

                    console.log(
                        "RAZORPAY PAYMENT FAILED:",
                        response
                    );

                    setLoading(false);

                    toast.error(

                        response.error?.description ||

                        "Payment failed. Please try again."

                    );

                }
            );


            // ======================================
            // OPEN RAZORPAY
            // ======================================

            razorpay.open();

        } catch (error) {

            console.log(
                "RAZORPAY CHECKOUT ERROR:",
                error
            );

            setLoading(false);

            toast.error(
                "Unable to open Razorpay"
            );

        }

    };


    // ==========================================
    // PLACE ORDER
    // ==========================================

    const onSubmitHandler = async (event) => {

        event.preventDefault();


        if (loading) {
            return;
        }


        try {

            setLoading(true);


            // ======================================
            // CHECK LOGIN
            // ======================================

            const currentToken =
                token ||
                localStorage.getItem("token");


            if (!currentToken) {

                toast.error(
                    "Please login before placing order"
                );

                navigate("/login", {

                    state: {

                        from: "place-order"

                    }

                });

                setLoading(false);

                return;

            }


            // ======================================
            // CREATE ORDER ITEMS
            // ======================================

            let orderItems = [];


            for (const items in cartItems) {

                for (const item in cartItems[items]) {

                    if (cartItems[items][item] > 0) {

                        const itemInfo =
                            structuredClone(

                                products.find(

                                    (product) =>
                                        product._id === items

                                )

                            );


                        if (itemInfo) {

                            itemInfo.size = item;

                            itemInfo.quantity =
                                cartItems[items][item];

                            orderItems.push(itemInfo);

                        }

                    }

                }

            }


            // ======================================
            // CHECK EMPTY CART
            // ======================================

            if (orderItems.length === 0) {

                toast.error(
                    "Your cart is empty"
                );

                setLoading(false);

                return;

            }


            // ======================================
            // TOTAL AMOUNT
            // ======================================

            const totalAmount =
                getCartAmount() +
                delivery_fee;


            // ======================================
            // ORDER DATA
            // ======================================

            const orderData = {

                address: formData,

                items: orderItems,

                amount: totalAmount

            };


            console.log(
                "ORDER DATA:",
                orderData
            );


            // ======================================
            // CASH ON DELIVERY
            // ======================================

            if (method === "cod") {

                const response =
                    await axios.post(

                        backendUrl +
                        "/api/order/place",

                        orderData,

                        {

                            headers: {

                                token: currentToken

                            }

                        }

                    );


                console.log(
                    "COD RESPONSE:",
                    response.data
                );


                if (response.data.success) {

                    toast.success(
                        "Order Placed Successfully"
                    );


                    // Clear cart
                    setCartItems({});


                    // Go to orders page
                    navigate("/orders");

                } else {

                    toast.error(

                        response.data.message ||
                        "Unable to place order"

                    );

                }

            }


            // ======================================
            // STRIPE
            // ======================================

            else if (method === "stripe") {

                const response =
                    await axios.post(

                        backendUrl +
                        "/api/order/stripe",

                        orderData,

                        {

                            headers: {

                                token: currentToken

                            }

                        }

                    );


                console.log(
                    "STRIPE RESPONSE:",
                    response.data
                );


                if (response.data.success) {

                    const {
                        session_url
                    } = response.data;


                    if (!session_url) {

                        toast.error(
                            "Stripe payment URL not received"
                        );

                        setLoading(false);

                        return;

                    }


                    // Stripe will handle payment
                    window.location.replace(
                        session_url
                    );

                } else {

                    toast.error(

                        response.data.message ||
                        "Unable to create Stripe payment"

                    );

                    setLoading(false);

                }

            }


            // ======================================
            // RAZORPAY
            // ======================================

            else if (method === "razorpay") {

                console.log(
                    "CREATING RAZORPAY ORDER..."
                );


                const response =
                    await axios.post(

                        backendUrl +
                        "/api/order/razorpay",

                        orderData,

                        {

                            headers: {

                                token: currentToken

                            }

                        }

                    );


                console.log(
                    "RAZORPAY CREATE RESPONSE:",
                    response.data
                );


                if (response.data.success) {

                    const {

                        razorpayOrderId,

                        orderId,

                        amount,

                        currency,

                        key

                    } = response.data;


                    // ==================================
                    // CHECK REQUIRED DATA
                    // ==================================

                    if (
                        !razorpayOrderId ||
                        !orderId ||
                        !amount ||
                        !key
                    ) {

                        console.log(
                            "INVALID RAZORPAY RESPONSE:",
                            response.data
                        );


                        toast.error(
                            "Invalid Razorpay order response"
                        );

                        setLoading(false);

                        return;

                    }


                    // ==================================
                    // OPEN RAZORPAY CHECKOUT
                    // ==================================

                    await openRazorpayCheckout({

                        razorpayOrderId,

                        orderId,

                        amount,

                        currency,

                        key

                    });

                } else {

                    toast.error(

                        response.data.message ||
                        "Unable to create Razorpay order"

                    );

                    setLoading(false);

                }

            }


        } catch (error) {

            console.log(
                "PLACE ORDER ERROR:",
                error
            );


            console.log(
                "SERVER RESPONSE:",
                error.response?.data
            );


            toast.error(

                error.response?.data?.message ||

                error.message ||

                "Something went wrong"

            );


            setLoading(false);

        }

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <form
            onSubmit={onSubmitHandler}
            className="
                flex
                flex-col
                sm:flex-row
                justify-between
                gap-4
                pt-5
                sm:pt-14
                min-h-[80vh]
                border-t
            "
        >

            {/* =====================================
                LEFT SIDE
            ===================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    w-full
                    sm:max-w-[480px]
                "
            >

                <div
                    className="
                        text-xl
                        sm:text-2xl
                        my-3
                    "
                >

                    <Title
                        text1={"DELIVERY"}
                        text2={"INFORMATION"}
                    />

                </div>


                {/* FIRST NAME + LAST NAME */}

                <div className="flex gap-3">

                    <input
                        required
                        onChange={onChangeHandler}
                        name="firstName"
                        value={formData.firstName}
                        className="
                            border
                            border-gray-300
                            rounded
                            py-1.5
                            px-3.5
                            w-full
                        "
                        type="text"
                        placeholder="First name"
                    />


                    <input
                        required
                        onChange={onChangeHandler}
                        name="lastName"
                        value={formData.lastName}
                        className="
                            border
                            border-gray-300
                            rounded
                            py-1.5
                            px-3.5
                            w-full
                        "
                        type="text"
                        placeholder="Last name"
                    />

                </div>


                {/* EMAIL */}

                <input
                    required
                    onChange={onChangeHandler}
                    name="email"
                    value={formData.email}
                    className="
                        border
                        border-gray-300
                        rounded
                        py-1.5
                        px-3.5
                        w-full
                    "
                    type="email"
                    placeholder="Email address"
                />


                {/* STREET */}

                <input
                    required
                    onChange={onChangeHandler}
                    name="street"
                    value={formData.street}
                    className="
                        border
                        border-gray-300
                        rounded
                        py-1.5
                        px-3.5
                        w-full
                    "
                    type="text"
                    placeholder="Street"
                />


                {/* CITY + STATE */}

                <div className="flex gap-3">

                    <input
                        required
                        onChange={onChangeHandler}
                        name="city"
                        value={formData.city}
                        className="
                            border
                            border-gray-300
                            rounded
                            py-1.5
                            px-3.5
                            w-full
                        "
                        type="text"
                        placeholder="City"
                    />


                    <input
                        required
                        onChange={onChangeHandler}
                        name="state"
                        value={formData.state}
                        className="
                            border
                            border-gray-300
                            rounded
                            py-1.5
                            px-3.5
                            w-full
                        "
                        type="text"
                        placeholder="State"
                    />

                </div>


                {/* ZIPCODE + COUNTRY */}

                <div className="flex gap-3">

                    <input
                        required
                        onChange={onChangeHandler}
                        name="zipcode"
                        value={formData.zipcode}
                        className="
                            border
                            border-gray-300
                            rounded
                            py-1.5
                            px-3.5
                            w-full
                        "
                        type="text"
                        placeholder="Zipcode"
                    />


                    <input
                        required
                        onChange={onChangeHandler}
                        name="country"
                        value={formData.country}
                        className="
                            border
                            border-gray-300
                            rounded
                            py-1.5
                            px-3.5
                            w-full
                        "
                        type="text"
                        placeholder="Country"
                    />

                </div>


                {/* PHONE */}

                <input
                    required
                    onChange={onChangeHandler}
                    name="phone"
                    value={formData.phone}
                    className="
                        border
                        border-gray-300
                        rounded
                        py-1.5
                        px-3.5
                        w-full
                    "
                    type="tel"
                    placeholder="Phone"
                />

            </div>


            {/* =====================================
                RIGHT SIDE
            ===================================== */}

            <div className="mt-8 min-w-80">


                {/* =================================
                    CART TOTAL
                ================================= */}

                <div className="mt-8">

                    <CartTotal />

                </div>


                {/* =================================
                    PAYMENT METHOD
                ================================= */}

                <div className="mt-12">

                    <Title
                        text1={"PAYMENT"}
                        text2={"METHOD"}
                    />


                    {/* PAYMENT OPTIONS */}

                    <div
                        className="
                            flex
                            gap-3
                            flex-col
                            lg:flex-row
                            mt-4
                        "
                    >


                        {/* ============================
                            STRIPE
                        ============================ */}

                        <div
                            onClick={() =>
                                !loading &&
                                setMethod("stripe")
                            }
                            className={`
                                flex
                                items-center
                                gap-3
                                border
                                p-2
                                px-3
                                cursor-pointer

                                ${
                                    method === "stripe"
                                        ? "border-black"
                                        : ""
                                }

                                ${
                                    loading
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }
                            `}
                        >

                            <p
                                className={`
                                    min-w-3.5
                                    h-3.5
                                    border
                                    rounded-full

                                    ${
                                        method === "stripe"
                                            ? "bg-green-400"
                                            : ""
                                    }
                                `}
                            ></p>


                            <img
                                src={assets.stripe_logo}
                                alt="Stripe"
                                className="w-12 h-auto"
                            />

                        </div>


                        {/* ============================
                            RAZORPAY
                        ============================ */}

                        <div
                            onClick={() =>
                                !loading &&
                                setMethod("razorpay")
                            }
                            className={`
                                flex
                                items-center
                                gap-3
                                border
                                p-2
                                px-3
                                cursor-pointer

                                ${
                                    method === "razorpay"
                                        ? "border-black"
                                        : ""
                                }

                                ${
                                    loading
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }
                            `}
                        >

                            <p
                                className={`
                                    min-w-3.5
                                    h-3.5
                                    border
                                    rounded-full

                                    ${
                                        method === "razorpay"
                                            ? "bg-green-400"
                                            : ""
                                    }
                                `}
                            ></p>


                            <img
                                src={assets.razorpay_logo}
                                alt="Razorpay"
                                className="w-16 h-auto"
                            />

                        </div>


                        {/* ============================
                            CASH ON DELIVERY
                        ============================ */}

                        <div
                            onClick={() =>
                                !loading &&
                                setMethod("cod")
                            }
                            className={`
                                flex
                                items-center
                                gap-3
                                border
                                p-2
                                px-3
                                cursor-pointer

                                ${
                                    method === "cod"
                                        ? "border-black"
                                        : ""
                                }

                                ${
                                    loading
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }
                            `}
                        >

                            <p
                                className={`
                                    min-w-3.5
                                    h-3.5
                                    border
                                    rounded-full

                                    ${
                                        method === "cod"
                                            ? "bg-green-400"
                                            : ""
                                    }
                                `}
                            ></p>


                            <p
                                className="
                                    text-gray-500
                                    text-sm
                                    font-medium
                                    mx-2
                                    whitespace-nowrap
                                "
                            >
                                CASH ON DELIVERY
                            </p>

                        </div>

                    </div>


                    {/* =================================
                        PLACE ORDER BUTTON
                    ================================= */}

                    <div
                        className="
                            w-full
                            text-end
                            mt-8
                        "
                    >

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                bg-black
                                text-white
                                px-16
                                py-3
                                text-sm
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >

                            {loading
                                ? "PROCESSING..."
                                : "PLACE ORDER"
                            }

                        </button>

                    </div>

                </div>

            </div>

        </form>

    );

};

export default PlaceOrder;