import React, {
    useContext,
    useEffect,
    useState
} from "react";

import { ShopContext } from "../context/ShopContext";

import { assets } from "../assets/assets";

const Cart = () => {

    // ==========================================
    // GET DATA FROM SHOP CONTEXT
    // ==========================================

    const {
        products,
        currency,
        cartItems,
        updateQuantity,
        navigate
    } = useContext(ShopContext);

    // ==========================================
    // CART DATA
    // ==========================================

    const [cartData, setCartData] =
        useState([]);

    // ==========================================
    // CREATE CART DATA
    // ==========================================

    useEffect(() => {

        if (products.length > 0) {

            const tempData = [];

            for (
                const items in cartItems
            ) {

                for (
                    const item in cartItems[items]
                ) {

                    if (
                        cartItems[items][item] > 0
                    ) {

                        tempData.push({

                            _id: items,

                            size: item,

                            quantity:
                                cartItems[items][item]

                        });
                    }
                }
            }

            setCartData(tempData);
        }

    }, [cartItems, products]);

    // ==========================================
    // RETURN
    // ==========================================

    return (

        <div className="border-t pt-14">

            {/* ==================================
                TITLE
            ================================== */}

            <div className="text-2xl mb-3">

                <div className="inline-flex gap-2 items-center mb-3">

                    <p className="text-gray-500">
                        YOUR
                    </p>

                    <p className="font-medium">
                        CART
                    </p>

                    <p className="w-8 sm:w-12 h-[1px] bg-gray-700"></p>

                </div>

            </div>

            {/* ==================================
                CART PRODUCTS
            ================================== */}

            <div>

                {cartData.map(
                    (item, index) => {

                        // Find product
                        const productData =
                            products.find(
                                (product) =>
                                    product._id ===
                                    item._id
                            );

                        // If product not found
                        if (!productData) {

                            return null;
                        }

                        return (

                            <div
                                key={index}
                                className="
                                    py-4
                                    border-t
                                    border-b
                                    text-gray-700
                                    grid
                                    grid-cols-[4fr_2fr_0.5fr]
                                    sm:grid-cols-[4fr_2fr_0.5fr]
                                    items-center
                                    gap-4
                                "
                            >

                                {/* ==========================
                                    PRODUCT INFORMATION
                                ========================== */}

                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-6
                                    "
                                >

                                    {/* PRODUCT IMAGE */}

                                    <img
                                        className="
                                            w-16
                                            sm:w-20
                                        "
                                        src={
                                            productData.image[0]
                                        }
                                        alt={
                                            productData.name
                                        }
                                    />

                                    {/* PRODUCT DETAILS */}

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                sm:text-lg
                                                font-medium
                                            "
                                        >
                                            {
                                                productData.name
                                            }
                                        </p>

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-5
                                                mt-2
                                            "
                                        >

                                            <p>
                                                {
                                                    currency
                                                }
                                                {
                                                    productData.price
                                                }
                                            </p>

                                            <p
                                                className="
                                                    px-2
                                                    sm:px-3
                                                    py-1
                                                    border
                                                    bg-slate-50
                                                "
                                            >
                                                {
                                                    item.size
                                                }
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                {/* ==========================
                                    QUANTITY
                                ========================== */}

                                <input
                                    type="number"
                                    min="1"
                                    defaultValue={
                                        item.quantity
                                    }
                                    className="
                                        border
                                        max-w-10
                                        sm:max-w-20
                                        px-1
                                        sm:px-2
                                        py-1
                                    "
                                    onChange={(e) => {

                                        const value =
                                            Number(
                                                e.target.value
                                            );

                                        if (value > 0) {

                                            updateQuantity(
                                                item._id,
                                                item.size,
                                                value
                                            );
                                        }

                                    }}
                                />

                                {/* ==========================
                                    DELETE ICON
                                ========================== */}

                                <img
                                    onClick={() =>
                                        updateQuantity(
                                            item._id,
                                            item.size,
                                            0
                                        )
                                    }
                                    className="
                                        w-4
                                        sm:w-5
                                        cursor-pointer
                                    "
                                    src={
                                        assets.bin_icon
                                    }
                                    alt="Remove"
                                />

                            </div>

                        );
                    }
                )}

            </div>

            {/* ==================================
                CART TOTAL + CHECKOUT
            ================================== */}

            <div
                className="
                    flex
                    justify-end
                    my-20
                "
            >

                <div
                    className="
                        w-full
                        sm:w-[450px]
                    "
                >

                    {/* ==================================
                        TOTAL
                    ================================== */}

                    <div
                        className="
                            w-full
                            text-2xl
                            mb-7
                        "
                    >

                        <div
                            className="
                                inline-flex
                                gap-2
                                items-center
                                mb-3
                            "
                        >

                            <p className="text-gray-500">
                                CART
                            </p>

                            <p className="font-medium">
                                TOTAL
                            </p>

                            <p className="w-8 sm:w-12 h-[1px] bg-gray-700">
                            </p>

                        </div>

                    </div>

                    {/* ==================================
                        TOTAL PRICE
                    ================================== */}

                    <div
                        className="
                            flex
                            justify-between
                            text-sm
                            mb-2
                        "
                    >

                        <p>
                            Subtotal
                        </p>

                        <p>
                            {currency}

                            {cartData.reduce(
                                (total, item) => {

                                    const productData =
                                        products.find(
                                            (product) =>
                                                product._id ===
                                                item._id
                                        );

                                    if (!productData) {
                                        return total;
                                    }

                                    return (
                                        total +
                                        productData.price *
                                        item.quantity
                                    );

                                },
                                0
                            )}

                        </p>

                    </div>

                    {/* ==================================
                        DELIVERY FEE
                    ================================== */}

                    <div
                        className="
                            flex
                            justify-between
                            text-sm
                            mb-2
                        "
                    >

                        <p>
                            Delivery Fee
                        </p>

                        <p>
                            {currency}10
                        </p>

                    </div>

                    {/* ==================================
                        TOTAL
                    ================================== */}

                    <div
                        className="
                            flex
                            justify-between
                            text-base
                            font-medium
                            border-t
                            pt-2
                        "
                    >

                        <p>
                            Total
                        </p>

                        <p>

                            {currency}

                            {
                                cartData.reduce(
                                    (
                                        total,
                                        item
                                    ) => {

                                        const productData =
                                            products.find(
                                                (product) =>
                                                    product._id ===
                                                    item._id
                                            );

                                        if (
                                            !productData
                                        ) {
                                            return total;
                                        }

                                        return (
                                            total +
                                            productData.price *
                                            item.quantity
                                        );

                                    },
                                    0
                                ) + 10
                            }

                        </p>

                    </div>

                    {/* ==================================
                        CHECKOUT BUTTON
                    ================================== */}

                    <div
                        className="
                            w-full
                            text-end
                            mt-8
                        "
                    >

                        <button
                            onClick={() =>
                                navigate(
                                    "/place-order"
                                )
                            }
                            className="
                                bg-black
                                text-white
                                text-sm
                                px-8
                                py-3
                            "
                        >
                            PROCEED TO CHECKOUT
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Cart;