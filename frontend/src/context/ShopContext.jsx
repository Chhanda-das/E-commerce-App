import {
    createContext,
    useEffect,
    useState,
    useRef,
} from "react";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import {
    products as localProducts
} from "../assets/assets";


// ======================================================
// CREATE CONTEXT
// ======================================================

export const ShopContext = createContext();


// ======================================================
// PROVIDER
// ======================================================

const ShopContextProvider = (props) => {

    // ==================================================
    // BASIC SETTINGS
    // ==================================================

    const currency = "₹";

    const delivery_fee = 10;


    // ==================================================
    // BACKEND URL
    // ==================================================

    const backendUrl =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:5000";


    // ==================================================
    // STATES
    // ==================================================

    const [search, setSearch] = useState("");

    const [showSearch, setShowSearch] = useState(false);

    const [cartItems, setCartItems] = useState({});

    const [products, setProducts] = useState([]);

    const [token, setToken] = useState("");


    // ==================================================
    // PRODUCT REQUEST CONTROL
    // ==================================================

    const productsRequestStarted = useRef(false);


    // ==================================================
    // NAVIGATION
    // ==================================================

    const navigate = useNavigate();


    // ======================================================
    // GET ALL PRODUCTS
    // ======================================================

    const getProductsData = async () => {

        try {

            console.log("========================================");
            console.log("GET PRODUCTS:");
            console.log(`${backendUrl}/api/product/list`);
            console.log("========================================");


            const response = await axios.get(
                `${backendUrl}/api/product/list`
            );


            console.log(
                "PRODUCT API RESPONSE:",
                response.data
            );


            // ==================================================
            // CHECK API RESPONSE
            // ==================================================

            if (!response.data?.success) {

                console.error(
                    "PRODUCT API FAILED:",
                    response.data?.message
                );


                toast.error(
                    response.data?.message ||
                    "Failed to load products"
                );


                return;
            }


            // ==================================================
            // BACKEND PRODUCTS
            // ==================================================

            const productList =
                Array.isArray(response.data.products)
                    ? response.data.products
                    : [];


            // ==================================================
            // LOCAL PRODUCTS
            //
            // Footwear + Perfume + Grocery + Watch
            // ==================================================

            const localProductsToAdd =
                localProducts.filter(
                    (item) =>
                        item.category === "Footwear" ||
                        item.category === "Perfume" ||
                        item.category === "Grocery" ||
                        item.category === "Watch" ||
                        item.category === "Bags" ||
                        item.category === "Beauty" ||
                        item.category === "Electronics"
                );


            // ==================================================
            // FOOTWEAR PRODUCTS
            // ==================================================

            const footwearProducts =
                localProductsToAdd.filter(
                    (item) =>
                        item.category === "Footwear"
                );


            // ==================================================
            // PERFUME PRODUCTS
            // ==================================================

            const perfumeProducts =
                localProductsToAdd.filter(
                    (item) =>
                        item.category === "Perfume"
                );


            // ==================================================
            // GROCERY PRODUCTS
            // ==================================================

            const groceryProducts =
                localProductsToAdd.filter(
                    (item) =>
                        item.category === "Grocery"
                );


            // ==================================================
            // WATCH PRODUCTS
            // ==================================================

            const watchProducts =
                localProductsToAdd.filter(
                    (item) =>
                        item.category === "Watch"
                );
            //bag products
            const bagProducts = localProductsToAdd.filter(
                (item) => item.category === "Bags"
            );

            console.log(
                "LOCAL BAG PRODUCTS:",
                bagProducts.length
            );
            //beauty products
            const beautyProducts = localProductsToAdd.filter(
                (item) => item.category === "Beauty"
            );
            const electronicsProducts = localProductsToAdd.filter(
                (item) => item.category === "Electronics"
            );

            console.log(
                "LOCAL ELECTRONICS PRODUCTS:",
                electronicsProducts.length
            );
            console.log(
                "LOCAL BEAUTY PRODUCTS:",
                beautyProducts.length
            );
            // ==================================================
            // CONSOLE LOGS
            // ==================================================

            console.log(
                "BACKEND PRODUCTS:",
                productList.length
            );


            console.log(
                "LOCAL FOOTWEAR PRODUCTS:",
                footwearProducts.length
            );


            console.log(
                "LOCAL PERFUME PRODUCTS:",
                perfumeProducts.length
            );


            console.log(
                "LOCAL GROCERY PRODUCTS:",
                groceryProducts.length
            );


            console.log(
                "LOCAL WATCH PRODUCTS:",
                watchProducts.length
            );


            // ==================================================
            // COMBINE ALL PRODUCTS
            // ==================================================

            const allProducts = [
                ...productList,
                ...localProductsToAdd
            ];


            // ==================================================
            // SAVE PRODUCTS
            // ==================================================

            setProducts(allProducts);


            // ==================================================
            // TOTAL PRODUCTS
            // ==================================================

            console.log(
                "TOTAL PRODUCTS:",
                allProducts.length
            );

        }

        catch (error) {

            // ==================================================
            // ERROR
            // ==================================================

            console.error(
                "GET PRODUCTS ERROR:",
                error
            );


            // ==================================================
            // NETWORK ERROR
            // ==================================================

            if (
                error.code === "ERR_NETWORK" ||
                error.message === "Network Error"
            ) {

                console.error(
                    "BACKEND SERVER IS NOT RUNNING."
                );


                console.error(
                    `Please start backend at ${backendUrl}`
                );


                toast.error(
                    "Backend server is not running"
                );

            }

            else {

                toast.error(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load products"
                );

            }

        }

    };


    // ======================================================
    // GET RELATED PRODUCTS
    // ======================================================

    const getRelatedProducts = (
        category,
        subCategory,
        currentProductId = ""
    ) => {

        if (
            !Array.isArray(products) ||
            products.length === 0
        ) {

            return [];

        }


        const categoryValue =
            String(category || "")
                .trim()
                .toLowerCase();


        const subCategoryValue =
            String(subCategory || "")
                .trim()
                .toLowerCase();


        return products.filter((item) => {


            // ==================================================
            // DON'T SHOW CURRENT PRODUCT
            // ==================================================

            if (
                String(item._id) ===
                String(currentProductId)
            ) {

                return false;

            }


            // ==================================================
            // ITEM CATEGORY
            // ==================================================

            const itemCategory =
                String(
                    item.category ||
                    item.Category ||
                    ""
                )
                    .trim()
                    .toLowerCase();


            // ==================================================
            // ITEM SUB CATEGORY
            // ==================================================

            const itemSubCategory =
                String(
                    item.subCategory ||
                    item.subcategory ||
                    ""
                )
                    .trim()
                    .toLowerCase();


            // ==================================================
            // MATCH CATEGORY OR SUBCATEGORY
            // ==================================================

            return (

                (
                    categoryValue &&
                    itemCategory === categoryValue
                )

                ||

                (
                    subCategoryValue &&
                    itemSubCategory === subCategoryValue
                )

            );

        });

    };


    // ======================================================
    // ADD TO CART
    // ======================================================

    const addToCart = async (
        itemId,
        size
    ) => {

        // ==================================================
        // CHECK PRODUCT ID
        // ==================================================

        if (!itemId) {

            toast.error(
                "Product not found"
            );

            return;
        }


        // ==================================================
        // CHECK SIZE
        // ==================================================

        if (!size) {

            toast.error(
                "Select Product Size"
            );

            return;
        }


        // ==================================================
        // CHECK PRODUCT
        // ==================================================

        const productExists =
            products.some(
                (product) =>
                    String(product._id) ===
                    String(itemId)
            );


        if (!productExists) {

            console.error(
                "PRODUCT NOT FOUND:",
                itemId
            );


            toast.error(
                "Product not found"
            );


            return;
        }


        // ==================================================
        // COPY CART
        // ==================================================

        const cartData =
            structuredClone(cartItems);


        // ==================================================
        // EXISTING PRODUCT
        // ==================================================

        if (cartData[itemId]) {


            // ==================================================
            // EXISTING SIZE
            // ==================================================

            if (
                cartData[itemId][size]
            ) {

                cartData[itemId][size] =
                    Number(
                        cartData[itemId][size]
                    ) + 1;

            }


            // ==================================================
            // NEW SIZE
            // ==================================================

            else {

                cartData[itemId][size] = 1;

            }

        }


        // ==================================================
        // NEW PRODUCT
        // ==================================================

        else {

            cartData[itemId] = {

                [size]: 1,

            };

        }


        // ==================================================
        // UPDATE FRONTEND
        // ==================================================

        setCartItems(cartData);


        // ==================================================
        // LOGGED-IN USER
        // ==================================================

        if (token) {

            try {

                const response =
                    await axios.post(

                        `${backendUrl}/api/cart/add`,

                        {
                            itemId: itemId,
                            size: size,
                        },

                        {
                            headers: {
                                token: token,
                            },
                        }

                    );


                console.log(
                    "ADD CART RESPONSE:",
                    response.data
                );


                if (
                    !response.data.success
                ) {

                    toast.error(
                        response.data.message ||
                        "Failed to add product to cart"
                    );


                    // ROLLBACK
                    await getUserCart(token);

                }

                else {

                    toast.success(
                        "Added to cart"
                    );

                }

            }

            catch (error) {

                console.error(
                    "ADD CART ERROR:",
                    error
                );


                // ROLLBACK
                await getUserCart(token);


                toast.error(
                    error.response
                        ?.data
                        ?.message ||

                    error.message ||

                    "Failed to add product to cart"
                );

            }

        }


        // ==================================================
        // GUEST USER
        // ==================================================

        else {

            localStorage.setItem(
                "cartItems",
                JSON.stringify(cartData)
            );


            toast.success(
                "Added to cart"
            );

        }

    };


    // ======================================================
    // GET CART COUNT
    // ======================================================

    const getCartCount = () => {

        let totalCount = 0;


        if (
            !cartItems ||
            typeof cartItems !== "object"
        ) {

            return 0;

        }


        for (
            const productId in cartItems
        ) {

            const sizes =
                cartItems[productId];


            if (
                !sizes ||
                typeof sizes !== "object"
            ) {

                continue;

            }


            for (
                const size in sizes
            ) {

                const quantity =
                    Number(
                        sizes[size]
                    );


                if (
                    quantity > 0
                ) {

                    totalCount += quantity;

                }

            }

        }


        return totalCount;

    };


    // ======================================================
    // UPDATE CART QUANTITY
    // ======================================================

    const updateQuantity = async (
        itemId,
        size,
        quantity
    ) => {

        const cartData =
            structuredClone(cartItems);


        // ==================================================
        // CREATE PRODUCT
        // ==================================================

        if (
            !cartData[itemId]
        ) {

            cartData[itemId] = {};

        }


        // ==================================================
        // UPDATE QUANTITY
        // ==================================================

        cartData[itemId][size] =
            Number(quantity);


        // ==================================================
        // REMOVE SIZE
        // ==================================================

        if (
            Number(quantity) <= 0
        ) {

            delete cartData[itemId][size];


            // REMOVE PRODUCT

            if (
                Object.keys(
                    cartData[itemId]
                ).length === 0
            ) {

                delete cartData[itemId];

            }

        }


        // ==================================================
        // UPDATE FRONTEND
        // ==================================================

        setCartItems(cartData);


        // ==================================================
        // GUEST USER
        // ==================================================

        if (!token) {

            localStorage.setItem(
                "cartItems",
                JSON.stringify(cartData)
            );

            return;

        }


        // ==================================================
        // SAVE TO DATABASE
        // ==================================================

        try {

            const response =
                await axios.post(

                    `${backendUrl}/api/cart/update`,

                    {
                        itemId: itemId,

                        size: size,

                        quantity:
                            Number(quantity),
                    },

                    {
                        headers: {
                            token: token,
                        },
                    }

                );


            console.log(
                "UPDATE CART RESPONSE:",
                response.data
            );


            if (
                !response.data.success
            ) {

                toast.error(
                    response.data.message ||
                    "Failed to update cart"
                );


                await getUserCart(token);

            }

        }

        catch (error) {

            console.error(
                "UPDATE CART ERROR:",
                error
            );


            await getUserCart(token);


            toast.error(
                error.response
                    ?.data
                    ?.message ||

                error.message ||

                "Failed to update cart"
            );

        }

    };


    // ======================================================
    // GET USER CART
    // ======================================================

    const getUserCart = async (
        userToken
    ) => {

        if (!userToken) {

            return;

        }


        try {

            const response =
                await axios.post(

                    `${backendUrl}/api/cart/get`,

                    {},

                    {
                        headers: {
                            token: userToken,
                        },
                    }

                );


            console.log(
                "USER CART RESPONSE:",
                response.data
            );


            if (
                response.data.success
            ) {

                setCartItems(
                    response.data.cartData || {}
                );

            }

            else {

                console.log(
                    "GET CART MESSAGE:",
                    response.data.message
                );

            }

        }

        catch (error) {

            console.error(
                "GET USER CART ERROR:",
                error
            );


            // Don't show error for
            // normal unauthenticated state.

            if (
                error.response
                    ?.status !== 401
            ) {

                toast.error(
                    error.response
                        ?.data
                        ?.message ||

                    error.message ||

                    "Failed to load cart"
                );

            }

        }

    };


    // ======================================================
    // GET CART AMOUNT
    // ======================================================

    const getCartAmount = () => {

        let totalAmount = 0;


        if (
            !cartItems ||
            !products ||
            !Array.isArray(products)
        ) {

            return 0;

        }


        for (
            const itemId in cartItems
        ) {

            const itemInfo =
                products.find(
                    (product) =>
                        String(product._id) ===
                        String(itemId)
                );


            if (!itemInfo) {

                console.warn(
                    "CART PRODUCT NOT FOUND:",
                    itemId
                );


                continue;

            }


            for (
                const size in cartItems[itemId]
            ) {

                const quantity =
                    Number(
                        cartItems[itemId][size]
                    );


                if (
                    quantity > 0
                ) {

                    totalAmount +=
                        Number(itemInfo.price) *
                        quantity;

                }

            }

        }


        return totalAmount;

    };


    // ======================================================
    // LOAD GUEST CART
    // ======================================================

    const getGuestCart = () => {

        try {

            const savedCart =
                localStorage.getItem(
                    "cartItems"
                );


            if (savedCart) {

                const parsedCart =
                    JSON.parse(savedCart);


                if (
                    parsedCart &&
                    typeof parsedCart === "object"
                ) {

                    setCartItems(
                        parsedCart
                    );

                }

            }

        }

        catch (error) {

            console.error(
                "GUEST CART ERROR:",
                error
            );

        }

    };


    // ======================================================
    // GET PRODUCTS WHEN APP LOADS
    // ======================================================

    useEffect(() => {

        // Prevent duplicate request
        // from the same provider instance.

        if (
            productsRequestStarted.current
        ) {

            return;

        }


        productsRequestStarted.current = true;


        getProductsData();

    }, []);


    // ======================================================
    // GET TOKEN WHEN APP LOADS
    // ======================================================

    useEffect(() => {

        const savedToken =
            localStorage.getItem(
                "token"
            );


        if (savedToken) {

            setToken(savedToken);

            getUserCart(
                savedToken
            );

        }

        else {

            getGuestCart();

        }

    }, []);


    // ======================================================
    // SAVE GUEST CART
    // ======================================================

    useEffect(() => {

        if (!token) {

            localStorage.setItem(
                "cartItems",
                JSON.stringify(cartItems)
            );

        }

    }, [
        cartItems,
        token
    ]);


    // ======================================================
    // CONTEXT VALUE
    // ======================================================

    const value = {

        // PRODUCTS
        products,
        getProductsData,
        getRelatedProducts,


        // CURRENCY
        currency,


        // DELIVERY
        delivery_fee,


        // SEARCH
        search,
        setSearch,


        // SEARCH BAR
        showSearch,
        setShowSearch,


        // CART
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        getUserCart,


        // NAVIGATION
        navigate,


        // BACKEND
        backendUrl,


        // AUTH
        token,
        setToken,

    };


    // ======================================================
    // PROVIDER
    // ======================================================

    return (

        <ShopContext.Provider
            value={value}
        >

            {props.children}

        </ShopContext.Provider>

    );

};


// ======================================================
// EXPORT
// ======================================================

export default ShopContextProvider;