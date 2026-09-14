import React, {
    createContext,
    useCallback,
    useEffect,
    useState,
} from "react";

import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {

    // ======================================================
    // BACKEND URL
    // ======================================================

    const backendUrl =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:5000";


    // ======================================================
    // ADMIN TOKEN
    // ======================================================

    const [token, setToken] = useState(
        () => localStorage.getItem("adminToken") || ""
    );


    // ======================================================
    // DATA
    // ======================================================

    const [products, setProducts] = useState([]);

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);


    // ======================================================
    // GET CURRENT ADMIN TOKEN
    // ======================================================

    const getAdminToken = useCallback(() => {

        return (
            token ||
            localStorage.getItem("adminToken") ||
            ""
        );

    }, [token]);


    // ======================================================
    // GET PRODUCTS
    // ======================================================

    const getProducts = useCallback(async () => {

        try {

            const response = await axios.get(
                `${backendUrl}/api/product/list`
            );


            if (response.data.success) {

                const data =
                    response.data.products || [];

                setProducts(data);

                return data;

            }


            toast.error(
                response.data.message ||
                "Failed to load products"
            );

            return [];

        } catch (error) {

            console.error(
                "GET PRODUCTS ERROR:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );


            toast.error(
                error.response?.data?.message ||
                "Failed to load products"
            );


            return [];

        }

    }, [backendUrl]);


    // ======================================================
    // GET ADMIN ORDERS
    // ======================================================

    const getOrders = useCallback(async () => {

        const currentToken =
            token ||
            localStorage.getItem("adminToken") ||
            "";


        // --------------------------------------------------
        // NO TOKEN
        // --------------------------------------------------

        if (!currentToken) {

            console.log(
                "GET ORDERS: NO ADMIN TOKEN"
            );

            setOrders([]);

            return [];

        }


        try {

            console.log(
                "================================"
            );

            console.log(
                "GETTING ADMIN ORDERS"
            );

            console.log(
                "ADMIN TOKEN: FOUND"
            );

            console.log(
                "BACKEND URL:",
                backendUrl
            );


            // --------------------------------------------------
            // REQUEST
            // --------------------------------------------------

            const response = await axios.post(

                `${backendUrl}/api/order/list`,

                {},

                {
                    headers: {
                        token: currentToken,
                    },
                }

            );


            console.log(
                "ALL ORDERS RESPONSE:",
                response.data
            );


            // --------------------------------------------------
            // SUCCESS
            // --------------------------------------------------

            if (response.data.success) {

                const data =
                    response.data.orders || [];


                console.log(
                    "ORDERS RECEIVED:",
                    data
                );


                console.log(
                    "ORDER COUNT:",
                    data.length
                );


                setOrders(data);

                return data;

            }


            toast.error(
                response.data.message ||
                "Failed to load orders"
            );


            setOrders([]);

            return [];

        } catch (error) {

            console.error(
                "GET ORDERS ERROR:",
                error
            );


            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );


            // --------------------------------------------------
            // TOKEN EXPIRED / UNAUTHORIZED
            // --------------------------------------------------

            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem(
                    "adminToken"
                );

                setToken("");

                setOrders([]);

            }


            toast.error(
                error.response?.data?.message ||
                "Failed to load orders"
            );


            return [];

        }

    }, [backendUrl, token]);


    // ======================================================
    // ADMIN LOGIN
    // ======================================================

    const login = async (
        email,
        password
    ) => {

        try {

            console.log(
                "================================"
            );

            console.log(
                "ADMIN LOGIN START"
            );

            console.log(
                "EMAIL:",
                email
            );

            console.log(
                "BACKEND URL:",
                backendUrl
            );


            // --------------------------------------------------
            // LOGIN REQUEST
            // --------------------------------------------------

            const response = await axios.post(

                `${backendUrl}/api/user/admin`,

                {
                    email,
                    password,
                },

                {
                    withCredentials: true,
                }

            );


            console.log(
                "ADMIN LOGIN RESPONSE:",
                response.data
            );


            // --------------------------------------------------
            // CHECK SUCCESS
            // --------------------------------------------------

            if (!response.data.success) {

                toast.error(
                    response.data.message ||
                    "Invalid admin credentials"
                );

                return false;

            }


            // --------------------------------------------------
            // GET TOKEN
            // --------------------------------------------------

            const adminToken =
                response.data.token;


            // --------------------------------------------------
            // TOKEN NOT RECEIVED
            // --------------------------------------------------

            if (!adminToken) {

                console.error(
                    "ADMIN LOGIN ERROR: TOKEN NOT RECEIVED"
                );


                console.error(
                    "LOGIN RESPONSE:",
                    response.data
                );


                toast.error(
                    "Login successful, but admin token was not received."
                );


                return false;

            }


            // --------------------------------------------------
            // SAVE TOKEN
            // --------------------------------------------------

            localStorage.setItem(
                "adminToken",
                adminToken
            );


            // --------------------------------------------------
            // UPDATE STATE
            // --------------------------------------------------

            setToken(adminToken);


            console.log(
                "ADMIN TOKEN SAVED"
            );


            // --------------------------------------------------
            // SUCCESS
            // --------------------------------------------------

            toast.success(
                response.data.message ||
                "Admin login successful"
            );


            console.log(
                "ADMIN LOGIN SUCCESS"
            );


            return true;


        } catch (error) {

            console.error(
                "ADMIN LOGIN ERROR:",
                error
            );


            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );


            toast.error(
                error.response?.data?.message ||
                "Admin login failed"
            );


            return false;

        }

    };


    // ======================================================
    // ADMIN LOGOUT
    // ======================================================

    const logout = useCallback(() => {
        console.log("LOGOUT START");

        // Clear browser token
        localStorage.removeItem("adminToken");

        // Clear session storage too, just in case
        sessionStorage.removeItem("adminToken");

        // Clear React state
        setToken("");
        setProducts([]);
        setOrders([]);

        console.log(
            "TOKEN AFTER LOGOUT:",
            localStorage.getItem("adminToken")
        );

        toast.success("Logged out successfully");
    }, []);

    // ======================================================
    // ADD PRODUCT
    // ======================================================

    const addProduct = async (form) => {

        try {

            const currentToken =
                getAdminToken();


            if (!currentToken) {

                toast.error(
                    "Please sign in as admin"
                );

                return false;

            }


            // --------------------------------------------------
            // FORM DATA
            // --------------------------------------------------

            const formData =
                new FormData();


            formData.append(
                "name",
                String(
                    form.name || ""
                ).trim()
            );


            formData.append(
                "description",
                String(
                    form.description || ""
                ).trim()
            );


            formData.append(
                "price",
                String(
                    form.price || 0
                )
            );


            formData.append(
                "category",
                form.category || ""
            );


            formData.append(
                "subCategory",
                form.subCategory || ""
            );


            formData.append(
                "productType",
                form.type || ""
            );


            formData.append(
                "gender",
                form.gender || ""
            );


            formData.append(
                "sizes",
                JSON.stringify(
                    form.sizes || []
                )
            );


            formData.append(
                "bestseller",
                String(
                    !!form.bestSeller
                )
            );


            // --------------------------------------------------
            // IMAGES
            // --------------------------------------------------

            const images =
                form.images || [];


            images.forEach(
                (image, index) => {

                    if (image) {

                        formData.append(
                            `image${index + 1}`,
                            image
                        );

                    }

                }
            );


            // --------------------------------------------------
            // API REQUEST
            // --------------------------------------------------

            const response =
                await axios.post(

                    `${backendUrl}/api/product/add`,

                    formData,

                    {
                        headers: {
                            token: currentToken,
                        },
                    }

                );


            // --------------------------------------------------
            // SUCCESS
            // --------------------------------------------------

            if (
                response.data.success
            ) {

                toast.success(
                    response.data.message ||
                    "Product added successfully"
                );


                await getProducts();


                return true;

            }


            toast.error(
                response.data.message ||
                "Product addition failed"
            );


            return false;


        } catch (error) {

            console.error(
                "ADD PRODUCT ERROR:",
                error
            );


            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );


            toast.error(
                error.response?.data?.message ||
                "Product addition failed"
            );


            return false;

        }

    };


    // ======================================================
    // REMOVE PRODUCT
    // ======================================================

    const removeProduct = async (id) => {

        try {

            const currentToken =
                getAdminToken();


            if (!currentToken) {

                toast.error(
                    "Please sign in as admin"
                );

                return false;

            }


            const response =
                await axios.post(

                    `${backendUrl}/api/product/remove`,

                    {
                        id,
                    },

                    {
                        headers: {
                            token: currentToken,
                        },
                    }

                );


            if (
                response.data.success
            ) {

                setProducts(
                    (previous) =>
                        previous.filter(
                            (product) =>
                                product._id !== id
                        )
                );


                toast.success(
                    response.data.message ||
                    "Product removed successfully"
                );


                return true;

            }


            toast.error(
                response.data.message ||
                "Product removal failed"
            );


            return false;


        } catch (error) {

            console.error(
                "REMOVE PRODUCT ERROR:",
                error
            );


            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );


            toast.error(
                error.response?.data?.message ||
                "Product removal failed"
            );


            return false;

        }

    };


    // ======================================================
    // UPDATE ORDER STATUS
    // ======================================================

    const updateOrderStatus = async (
        orderId,
        status
    ) => {

        try {

            const currentToken =
                getAdminToken();


            if (!currentToken) {

                toast.error(
                    "Please sign in as admin"
                );

                return false;

            }


            console.log(
                "UPDATE ORDER:",
                orderId,
                status
            );


            const response =
                await axios.post(

                    `${backendUrl}/api/order/status`,

                    {
                        orderId,
                        status,
                    },

                    {
                        headers: {
                            token: currentToken,
                        },
                    }

                );


            console.log(
                "STATUS RESPONSE:",
                response.data
            );


            if (
                response.data.success
            ) {

                setOrders(
                    (previous) =>
                        previous.map(
                            (order) =>
                                order._id === orderId
                                    ? {
                                        ...order,
                                        status,
                                    }
                                    : order
                        )
                );


                toast.success(
                    response.data.message ||
                    "Order status updated"
                );


                return true;

            }


            toast.error(
                response.data.message ||
                "Status update failed"
            );


            return false;


        } catch (error) {

            console.error(
                "UPDATE ORDER STATUS ERROR:",
                error
            );


            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );


            toast.error(
                error.response?.data?.message ||
                "Status update failed"
            );


            return false;

        }

    };


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {

        let cancelled = false;


        const loadInitialData = async () => {

            setLoading(true);


            try {

                // --------------------------------------------------
                // LOAD PRODUCTS
                // --------------------------------------------------

                await getProducts();


                if (cancelled) {
                    return;
                }


                // --------------------------------------------------
                // LOAD ORDERS IF ADMIN IS LOGGED IN
                // --------------------------------------------------

                const savedAdminToken =
                    localStorage.getItem(
                        "adminToken"
                    );


                if (
                    savedAdminToken
                ) {

                    await getOrders();

                } else {

                    setOrders([]);

                }


            } finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        };


        loadInitialData();


        return () => {

            cancelled = true;

        };

    }, [
        getProducts,
        getOrders,
    ]);


    // ======================================================
    // CONTEXT VALUE
    // ======================================================

    const value = {

        backendUrl,

        token,

        setToken,

        products,

        orders,

        loading,

        login,

        logout,

        getProducts,

        getOrders,

        addProduct,

        removeProduct,

        updateOrderStatus,

    };


    // ======================================================
    // PROVIDER
    // ======================================================

    return (

        <AdminContext.Provider
            value={value}
        >

            {children}

        </AdminContext.Provider>

    );

};


export default AdminContextProvider;