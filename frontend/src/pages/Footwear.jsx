import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ShopContext } from "../context/ShopContext";

// =====================================================
// FOOTWEAR IMAGES
// =====================================================

const imageFiles = import.meta.glob(
    "../assets/footwear/*.{jpg,jpeg,png,JPG,JPEG,PNG}",
    {
        eager: true,
        query: "?url",
        import: "default",
    }
);


// =====================================================
// GET IMAGE
// =====================================================

const getImage = (fileName) => {
    const exactPath = `../assets/footwear/${fileName}`;

    if (imageFiles[exactPath]) {
        return imageFiles[exactPath];
    }

    const foundPath = Object.keys(imageFiles).find(
        (path) =>
            path.toLowerCase() ===
            exactPath.toLowerCase()
    );

    return foundPath ? imageFiles[foundPath] : "";
};


// =====================================================
// FOOTWEAR PRODUCTS
// =====================================================

const footwearProducts = [
    {
        id: "f1",
        name: "Classic Leather Sneakers",
        price: 2499,
        oldPrice: 3299,
        category: "Sneakers",
        image: getImage("f1.jpg"),
    },

    {
        id: "f2",
        name: "Minimal White Sneakers",
        price: 2299,
        oldPrice: 2999,
        category: "Sneakers",
        image: getImage("f2.jpg"),
    },

    {
        id: "f3",
        name: "Everyday Casual Shoes",
        price: 1999,
        oldPrice: 2699,
        category: "Shoes",
        image: getImage("f3.jpg"),
    },

    {
        id: "f4",
        name: "Premium Running Shoes",
        price: 2899,
        oldPrice: 3799,
        category: "Running Shoes",
        image: getImage("f4.jpg"),
    },

    {
        id: "f5",
        name: "Classic Black Shoes",
        price: 2599,
        oldPrice: 3399,
        category: "Shoes",
        image: getImage("f5.jpg"),
    },

    {
        id: "f6",
        name: "Modern Lifestyle Sneakers",
        price: 2799,
        oldPrice: 3599,
        category: "Lifestyle Shoes",
        image: getImage("f6.jpg"),
    },

    {
        id: "f7",
        name: "Comfort Sandals",
        price: 1299,
        oldPrice: 1799,
        category: "Sandals",
        image: getImage("f7.jpg"),
    },

    {
        id: "f8",
        name: "Premium Casual Sneakers",
        price: 2399,
        oldPrice: 3199,
        category: "Sneakers",
        image: getImage("f8.jpg"),
    },

    {
        id: "f9",
        name: "Classic Formal Shoes",
        price: 2999,
        oldPrice: 3899,
        category: "Shoes",
        image: getImage("f9.jpg"),
    },

    {
        id: "f10",
        name: "Urban Street Sneakers",
        price: 2699,
        oldPrice: 3499,
        category: "Sneakers",
        image: getImage("f10.jpg"),
    },

    {
        id: "f11",
        name: "Lightweight Running Shoes",
        price: 3099,
        oldPrice: 3999,
        category: "Running Shoes",
        image: getImage("f11.jpg"),
    },

    {
        id: "f12",
        name: "Comfort Everyday Sandals",
        price: 1199,
        oldPrice: 1699,
        category: "Sandals",
        image: getImage("f12.jpg"),
    },

    {
        id: "f13",
        name: "Classic Chelsea Boots",
        price: 3499,
        oldPrice: 4499,
        category: "Boots",
        image: getImage("f13.jpg"),
    },

    {
        id: "f14",
        name: "Premium Leather Boots",
        price: 3999,
        oldPrice: 4999,
        category: "Boots",
        image: getImage("f14.jpg"),
    },

    {
        id: "f15",
        name: "Modern Heels",
        price: 2199,
        oldPrice: 2899,
        category: "Heels",
        image: getImage("f15.jpg"),
    },

    {
        id: "f16",
        name: "Elegant Classic Heels",
        price: 2499,
        oldPrice: 3299,
        category: "Heels",
        image: getImage("f16.jpg"),
    },

    {
        id: "f17",
        name: "Soft Comfort Slippers",
        price: 799,
        oldPrice: 1199,
        category: "Slippers",
        image: getImage("f17.jpg"),
    },

    {
        id: "f18",
        name: "Premium Home Slippers",
        price: 899,
        oldPrice: 1299,
        category: "Slippers",
        image: getImage("f18.jpg"),
    },

    {
        id: "f19",
        name: "Sport Lifestyle Shoes",
        price: 2799,
        oldPrice: 3599,
        category: "Lifestyle Shoes",
        image: getImage("f19.jpg"),
    },

    {
        id: "f20",
        name: "Classic Everyday Sneakers",
        price: 2199,
        oldPrice: 2999,
        category: "Sneakers",
        image: getImage("f20.jpg"),
    },

    {
        id: "f21",
        name: "Performance Running Shoes",
        price: 3299,
        oldPrice: 4299,
        category: "Running Shoes",
        image: getImage("f21.jpg"),
    },

    {
        id: "f22",
        name: "Premium Lifestyle Shoes",
        price: 2899,
        oldPrice: 3799,
        category: "Lifestyle Shoes",
        image: getImage("f22.jpg"),
    },
];


// =====================================================
// CATEGORIES
// =====================================================

const categories = [
    "All",
    "Shoes",
    "Sneakers",
    "Sandals",
    "Heels",
    "Boots",
    "Slippers",
    "Running Shoes",
    "Lifestyle Shoes",
];


// =====================================================
// COMPONENT
// =====================================================

const Footwear = () => {

    const {
        products,
        addToCart,
    } = useContext(ShopContext);


    const [activeCategory, setActiveCategory] =
        useState("All");

    const [search, setSearch] =
        useState("");


    // =================================================
    // FIND REAL BACKEND PRODUCT
    // =================================================

    const findRealProduct = (footwearProduct) => {

        if (!products || !Array.isArray(products)) {
            return null;
        }

        const footwearName =
            footwearProduct.name
                .trim()
                .toLowerCase();

        return products.find(
            (product) => {

                const productName =
                    String(product.name || "")
                        .trim()
                        .toLowerCase();

                return productName === footwearName;
            }
        );
    };


    // =================================================
    // ADD TO CART
    // =================================================

    const handleAddToCart = async (
        event,
        footwearProduct
    ) => {

        event.preventDefault();
        event.stopPropagation();


        const realProduct =
            findRealProduct(footwearProduct);


        if (!realProduct) {

            alert(
                "This footwear product is not available in the product database."
            );

            return;
        }


        // ---------------------------------------------
        // GET SIZE FROM BACKEND PRODUCT
        // ---------------------------------------------

        let selectedSize = "Default";


        if (
            Array.isArray(realProduct.sizes) &&
            realProduct.sizes.length > 0
        ) {
            selectedSize =
                realProduct.sizes[0];
        }

        else if (
            Array.isArray(realProduct.size) &&
            realProduct.size.length > 0
        ) {
            selectedSize =
                realProduct.size[0];
        }

        else if (
            typeof realProduct.size === "string" &&
            realProduct.size.trim() !== ""
        ) {
            selectedSize =
                realProduct.size;
        }


        // ---------------------------------------------
        // EXISTING CART SYSTEM
        // ---------------------------------------------

        try {

            await addToCart(
                realProduct._id,
                selectedSize
            );

        } catch (error) {

            console.error(
                "Add footwear to cart error:",
                error
            );

        }

    };


    // =================================================
    // FILTER
    // =================================================

    const filteredProducts = useMemo(() => {

        const searchText =
            search.trim().toLowerCase();

        return footwearProducts.filter(
            (product) => {

                const categoryMatch =
                    activeCategory === "All" ||
                    product.category === activeCategory;

                const searchMatch =
                    product.name
                        .toLowerCase()
                        .includes(searchText);

                return (
                    categoryMatch &&
                    searchMatch &&
                    product.image
                );

            }
        );

    }, [activeCategory, search]);


    // =================================================
    // PRICE
    // =================================================

    const formatPrice = (price) => {

        return Number(price).toLocaleString(
            "en-IN"
        );

    };


    // =================================================
    // JSX
    // =================================================

    return (

        <section className="w-full">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="
                px-5
                sm:px-8
                lg:px-12
                pt-10
                sm:pt-14
                pb-8
            ">

                <div className="max-w-7xl mx-auto">

                    <p className="
                        text-xs
                        uppercase
                        tracking-[0.3em]
                        text-gray-400
                        mb-3
                    ">
                        FOREVER COLLECTION
                    </p>


                    <div className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-end
                        md:justify-between
                        gap-5
                    ">

                        <div>

                            <h1 className="
                                text-4xl
                                sm:text-5xl
                                lg:text-6xl
                                font-light
                                tracking-tight
                                text-gray-900
                            ">
                                Footwear
                            </h1>


                            <p className="
                                mt-4
                                max-w-xl
                                text-sm
                                sm:text-base
                                leading-7
                                text-gray-500
                            ">
                                Discover timeless footwear designed
                                for everyday living, comfort, and
                                effortless style.
                            </p>

                        </div>


                        <p className="
                            text-sm
                            text-gray-400
                        ">
                            {filteredProducts.length} Products
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================================
                SEARCH + FILTER
            ========================================= */}

            <div className="
                px-5
                sm:px-8
                lg:px-12
                pb-8
            ">

                <div className="
                    max-w-7xl
                    mx-auto
                    border-y
                    border-gray-200
                    py-5
                ">

                    <div className="
                        flex
                        flex-col
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                        gap-5
                    ">

                        {/* SEARCH */}

                        <div className="
                            relative
                            w-full
                            lg:max-w-xs
                        ">

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search footwear"
                                className="
                                    w-full
                                    border-b
                                    border-gray-300
                                    bg-transparent
                                    px-0
                                    py-3
                                    pr-8
                                    text-sm
                                    outline-none
                                    placeholder:text-gray-400
                                    focus:border-black
                                "
                            />

                            <span className="
                                absolute
                                right-0
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                            ">
                                ⌕
                            </span>

                        </div>


                        {/* CATEGORIES */}

                        <div className="
                            flex
                            gap-2
                            overflow-x-auto
                            pb-1
                        ">

                            {categories.map(
                                (category) => (

                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() =>
                                            setActiveCategory(
                                                category
                                            )
                                        }
                                        className={`
                                            whitespace-nowrap
                                            px-4
                                            py-2
                                            text-xs
                                            tracking-wide
                                            border
                                            transition

                                            ${
                                                activeCategory ===
                                                category
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black"
                                            }
                                        `}
                                    >
                                        {category}
                                    </button>

                                )
                            )}

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================================
                PRODUCTS
            ========================================= */}

            <div className="
                px-5
                sm:px-8
                lg:px-12
                pb-16
            ">

                <div className="
                    max-w-7xl
                    mx-auto
                ">

                    {filteredProducts.length === 0 ? (

                        <div className="
                            min-h-[300px]
                            flex
                            flex-col
                            items-center
                            justify-center
                            text-center
                        ">

                            <p className="
                                text-4xl
                                mb-4
                            ">
                                ⌕
                            </p>

                            <h2 className="
                                text-xl
                                font-medium
                            ">
                                No footwear found
                            </h2>

                            <p className="
                                text-sm
                                text-gray-500
                                mt-2
                            ">
                                Try another search or category.
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setActiveCategory("All");
                                }}
                                className="
                                    mt-5
                                    underline
                                    underline-offset-4
                                    text-sm
                                "
                            >
                                Clear filters
                            </button>

                        </div>

                    ) : (

                        <div className="
                            grid
                            grid-cols-2
                            md:grid-cols-3
                            lg:grid-cols-4
                            gap-x-4
                            sm:gap-x-6
                            gap-y-10
                        ">

                            {filteredProducts.map(
                                (product) => (

                                    <div
                                        key={product.id}
                                        className="group block"
                                    >

                                        {/* =================================
                                            PRODUCT IMAGE
                                        ================================= */}

                                        <Link
                                            to={`/product/${product.id}`}
                                            className="block"
                                        >

                                            <div className="
                                                relative
                                                overflow-hidden
                                                bg-[#f5f5f3]
                                                aspect-[3/4]
                                            ">

                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    loading="lazy"
                                                    className="
                                                        w-full
                                                        h-full
                                                        object-cover
                                                        transition
                                                        duration-700
                                                        ease-out
                                                        group-hover:scale-105
                                                    "
                                                />


                                                <div className="
                                                    absolute
                                                    inset-x-0
                                                    bottom-0
                                                    translate-y-full
                                                    group-hover:translate-y-0
                                                    transition
                                                    duration-300
                                                ">

                                                    <div className="
                                                        bg-black
                                                        text-white
                                                        text-center
                                                        py-3
                                                        text-xs
                                                        tracking-[0.15em]
                                                        uppercase
                                                    ">
                                                        View Product
                                                    </div>

                                                </div>

                                            </div>

                                        </Link>


                                        {/* =================================
                                            PRODUCT INFO
                                        ================================= */}

                                        <div className="pt-4">

                                            <p className="
                                                text-[10px]
                                                uppercase
                                                tracking-[0.18em]
                                                text-gray-400
                                                mb-2
                                            ">
                                                {product.category}
                                            </p>


                                            <Link
                                                to={`/product/${product.id}`}
                                            >

                                                <h2 className="
                                                    text-sm
                                                    sm:text-base
                                                    font-normal
                                                    text-gray-900
                                                    leading-6
                                                    hover:underline
                                                    underline-offset-4
                                                ">
                                                    {product.name}
                                                </h2>

                                            </Link>


                                            <div className="
                                                flex
                                                items-center
                                                gap-2
                                                mt-2
                                            ">

                                                <span className="
                                                    text-sm
                                                    font-medium
                                                ">
                                                    ₹
                                                    {formatPrice(
                                                        product.price
                                                    )}
                                                </span>


                                                <span className="
                                                    text-xs
                                                    text-gray-400
                                                    line-through
                                                ">
                                                    ₹
                                                    {formatPrice(
                                                        product.oldPrice
                                                    )}
                                                </span>

                                            </div>


                                            {/* =================================
                                                ADD TO CART
                                            ================================= */}

                                            <button
                                                type="button"
                                                onClick={(event) =>
                                                    handleAddToCart(
                                                        event,
                                                        product
                                                    )
                                                }
                                                className="
                                                    w-full
                                                    mt-4
                                                    border
                                                    border-black
                                                    bg-black
                                                    text-white
                                                    py-3
                                                    text-xs
                                                    uppercase
                                                    tracking-[0.15em]
                                                    transition
                                                    hover:bg-white
                                                    hover:text-black
                                                "
                                            >
                                                Add to Cart
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </section>
    );
};


export default Footwear;