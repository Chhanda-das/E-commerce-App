import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Verify = () => {

    const {
        backendUrl,
        token,
        setCartItems
    } = useContext(ShopContext);

    const location = useLocation();
    const navigate = useNavigate();


    useEffect(() => {

        const verifyPayment = async () => {

            try {

                // ======================================
                // GET STRIPE URL PARAMETERS
                // ======================================

                const params =
                    new URLSearchParams(location.search);

                const success =
                    params.get("success");

                const sessionId =
                    params.get("session_id");


                console.log(
                    "STRIPE SUCCESS:",
                    success
                );

                console.log(
                    "STRIPE SESSION ID:",
                    sessionId
                );


                // ======================================
                // CHECK PAYMENT
                // ======================================

                if (
                    success !== "true" ||
                    !sessionId
                ) {

                    toast.error(
                        "Invalid Stripe payment"
                    );

                    navigate("/place-order");

                    return;

                }


                // ======================================
                // GET TOKEN
                // ======================================

                const currentToken =
                    token ||
                    localStorage.getItem("token");


                if (!currentToken) {

                    toast.error(
                        "Please login again"
                    );

                    navigate("/login");

                    return;

                }


                // ======================================
                // VERIFY STRIPE PAYMENT
                // ======================================

                const response =
                    await axios.post(

                        backendUrl +
                        "/api/order/verify-stripe",

                        {
                            sessionId: sessionId
                        },

                        {
                            headers: {

                                token:
                                    currentToken

                            }

                        }

                    );


                console.log(
                    "STRIPE VERIFY RESPONSE:",
                    response.data
                );


                // ======================================
                // PAYMENT SUCCESS
                // ======================================

                if (response.data.success) {

                    toast.success(
                        "Payment successful! Order placed."
                    );


                    // Clear cart
                    setCartItems({});


                    // Go to orders
                    navigate("/orders");

                } else {

                    toast.error(

                        response.data.message ||
                        "Payment verification failed"

                    );

                    navigate("/place-order");

                }


            } catch (error) {

                console.log(
                    "STRIPE VERIFY ERROR:",
                    error
                );

                console.log(
                    "STRIPE SERVER RESPONSE:",
                    error.response?.data
                );


                toast.error(

                    error.response?.data?.message ||

                    "Stripe payment verification failed"

                );


                navigate("/place-order");

            }

        };


        verifyPayment();

    }, [
        backendUrl,
        token,
        location.search,
        navigate,
        setCartItems
    ]);


    // ==========================================
    // LOADING SCREEN
    // ==========================================

    return (

        <div className="
            min-h-[60vh]
            flex
            items-center
            justify-center
        ">

            <div className="text-center">

                <h2 className="
                    text-2xl
                    font-medium
                ">
                    Verifying Payment...
                </h2>


                <p className="
                    text-gray-500
                    mt-2
                ">
                    Please wait while we confirm your payment.
                </p>

            </div>

        </div>

    );

};

export default Verify;