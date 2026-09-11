import React, { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ShopContext } from "../context/ShopContext";

import "../components/css/Collection.css";

// ======================================================
// COLLECTION PAGE
// ======================================================

const Collection = () => {

    const {
        products,
        currency,
        search,
    } = useContext(ShopContext);

    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState("All");


    // ======================================================
    // CATEGORY LIST
    // ======================================================

    const categories = [

        {
            name: "Clothing",
            icon: "👕",
            value: "Clothing",
        },

        {
            name: "Footwear",
            icon: "👟",
            value: "Footwear",
        },

        {
            name: "Perfume",
            icon: "🌸",
            value: "Perfume",
        },

        {
            name: "Grocery",
            icon: "🛒",
            value: "Grocery",
        },

        {
            name: "Watches",
            icon: "⌚",
            value: "Watch", // IMPORTANT: Watch, not Watches
        },

        {
            name: "Bags",
            icon: "👜",
            value: "Bags",
        },

        {
            name: "Beauty",
            icon: "💄",
            value: "Beauty",
        },

        {
            name: "Electronics",
            icon: "🎧",
            value: "Electronics",
        },

    ];


    // ======================================================
    // FILTER PRODUCTS
    // ======================================================

    const filteredProducts = useMemo(() => {

        if (!Array.isArray(products)) {
            return [];
        }

        let result = [...products];


        // ==================================================
        // SEARCH FILTER
        // ==================================================

        if (
            search &&
            search.trim() !== ""
        ) {

            const searchText =
                search
                    .trim()
                    .toLowerCase();


            result = result.filter((product) => {

                const name =
                    String(
                        product.name || ""
                    ).toLowerCase();


                const description =
                    String(
                        product.description || ""
                    ).toLowerCase();


                const category =
                    String(
                        product.category ||
                        product.Category ||
                        ""
                    ).toLowerCase();


                const subCategory =
                    String(
                        product.subCategory ||
                        product.subcategory ||
                        ""
                    ).toLowerCase();


                return (
                    name.includes(searchText) ||
                    description.includes(searchText) ||
                    category.includes(searchText) ||
                    subCategory.includes(searchText)
                );

            });

        }


        // ==================================================
        // CATEGORY FILTER
        // ==================================================

        if (
            selectedCategory !== "All"
        ) {

            const selected =
                selectedCategory
                    .trim()
                    .toLowerCase();


            result =
                result.filter((product) => {

                    const category =
                        String(
                            product.category ||
                            product.Category ||
                            ""
                        )
                            .trim()
                            .toLowerCase();


                    const subCategory =
                        String(
                            product.subCategory ||
                            product.subcategory ||
                            ""
                        )
                            .trim()
                            .toLowerCase();


                    const type =
                        String(
                            product.type ||
                            product.productType ||
                            ""
                        )
                            .trim()
                            .toLowerCase();


                    // ======================================
                    // CLOTHING
                    // ======================================

                    if (
                        selectedCategory === "Clothing"
                    ) {

                        return (
                            category === "men" ||
                            category === "women" ||
                            category === "kids" ||
                            category === "clothing" ||
                            category === "clothes"
                        );

                    }


                    // ======================================
                    // FOOTWEAR
                    // ======================================

                    if (
                        selectedCategory === "Footwear"
                    ) {

                        return (

                            category === "footwear" ||
                            category === "footwears" ||
                            category === "shoe" ||
                            category === "shoes" ||

                            subCategory === "footwear" ||
                            subCategory === "footwears" ||
                            subCategory === "shoe" ||
                            subCategory === "shoes" ||

                            type === "footwear" ||
                            type === "footwears" ||
                            type === "shoe" ||
                            type === "shoes"

                        );

                    }


                    // ======================================
                    // WATCH
                    // ======================================

                    if (
                        selectedCategory === "Watch"
                    ) {

                        return (

                            category === "watch" ||
                            category === "watches" ||

                            subCategory === "watch" ||
                            subCategory === "watches" ||

                            type === "watch" ||
                            type === "watches"

                        );

                    }


                    // ======================================
                    // PERFUME
                    // ======================================

                    if (
                        selectedCategory === "Perfume"
                    ) {

                        return (

                            category === "perfume" ||
                            category === "perfumes" ||

                            subCategory === "perfume" ||
                            subCategory === "perfumes" ||

                            type === "perfume" ||
                            type === "perfumes"

                        );

                    }


                    // ======================================
                    // GROCERY
                    // ======================================

                    if (
                        selectedCategory === "Grocery"
                    ) {

                        return (

                            category === "grocery" ||
                            category === "groceries" ||

                            subCategory === "grocery" ||
                            subCategory === "groceries" ||

                            type === "grocery" ||
                            type === "groceries"

                        );

                    }


                    // ======================================
                    // OTHER CATEGORIES
                    // ======================================

                    return (

                        category === selected ||
                        subCategory === selected ||
                        type === selected

                    );

                });

        }


        return result;

    }, [
        products,
        search,
        selectedCategory,
    ]);


    // ======================================================
    // CLEAR FILTER
    // ======================================================

    const clearFilters = () => {

        setSelectedCategory("All");

    };


    // ======================================================
    // CATEGORY NAVIGATION
    // ======================================================

    const handleCategoryClick = (category) => {

        // ================================================
        // FOOTWEAR
        // ================================================

        if (
            category.value === "Footwear"
        ) {

            navigate("/footwear");

            return;

        }


        // ================================================
        // OTHER CATEGORIES
        // ================================================

        setSelectedCategory(
            category.value
        );

    };


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <main className="collection-page">


            {/* ==================================================
                TOP HEADER
            ================================================== */}

            <section className="collection-heading">

                <div>

                    <p className="collection-eyebrow">
                        THE FOREVER EDIT · 01
                    </p>


                    <h1>

                        {selectedCategory === "All"
                            ? "All"
                            : selectedCategory}

                        <span>
                            {" "}Collections
                        </span>

                    </h1>


                    <p className="collection-subtitle">
                        Explore timeless pieces selected for
                        everyday elegance, comfort and style.
                    </p>

                </div>


                <div className="collection-total">

                    <span>
                        SHOWING
                    </span>


                    <strong>

                        {String(
                            filteredProducts.length
                        ).padStart(
                            2,
                            "0"
                        )}

                    </strong>

                </div>

            </section>


            {/* ==================================================
                MAIN COLLECTION AREA
            ================================================== */}

            <section className="collection-layout">


                {/* ==================================================
                    FILTER SIDEBAR
                ================================================== */}

                <aside className="collection-filter">


                    {/* FILTER HEADER */}

                    <div className="filter-top">

                        <div>

                            <p className="filter-label">
                                REFINE
                            </p>


                            <h2>
                                Filters
                            </h2>

                        </div>


                        <span className="filter-star">
                            ✦
                        </span>

                    </div>


                    {/* ==================================================
                        CATEGORY
                    ================================================== */}

                    <div className="filter-section">


                        <div className="filter-section-title">

                            <span>
                                CATEGORY
                            </span>


                            <small>

                                {selectedCategory === "All"
                                    ? "01"
                                    : "02"}

                            </small>

                        </div>


                        <div className="category-list">


                            {/* ==================================================
                                ALL COLLECTIONS
                            ================================================== */}

                            <button
                                type="button"

                                className={`category-button ${
                                    selectedCategory === "All"
                                        ? "active"
                                        : ""
                                }`}

                                onClick={() => {

                                    setSelectedCategory(
                                        "All"
                                    );

                                }}
                            >

                                <span className="category-icon">
                                    ✦
                                </span>


                                <span>
                                    All Collections
                                </span>

                            </button>


                            {/* ==================================================
                                CATEGORY BUTTONS
                            ================================================== */}

                            {categories.map(
                                (category) => (

                                    <button
                                        type="button"

                                        key={
                                            category.value
                                        }

                                        className={`category-button ${
                                            selectedCategory ===
                                            category.value
                                                ? "active"
                                                : ""
                                        }`}

                                        onClick={() =>
                                            handleCategoryClick(
                                                category
                                            )
                                        }
                                    >

                                        <span className="category-icon">
                                            {
                                                category.icon
                                            }
                                        </span>


                                        <span>
                                            {
                                                category.name
                                            }
                                        </span>

                                    </button>

                                )
                            )}

                        </div>

                    </div>


                    {/* ==================================================
                        CLEAR FILTER
                    ================================================== */}

                    {selectedCategory !==
                        "All" && (

                        <button
                            type="button"

                            className="clear-filter-button"

                            onClick={
                                clearFilters
                            }
                        >

                            CLEAR ALL FILTERS

                        </button>

                    )}

                </aside>


                {/* ==================================================
                    PRODUCTS AREA
                ================================================== */}

                <div className="collection-products-area">


                    {/* ==================================================
                        PRODUCT HEADER
                    ================================================== */}

                    <div className="products-topbar">

                        <div>

                            <p>

                                {selectedCategory ===
                                    "All"
                                    ? "ALL COLLECTIONS"
                                    : `${selectedCategory.toUpperCase()} COLLECTION`}

                            </p>


                            <span>

                                {
                                    filteredProducts.length
                                }{" "}

                                {
                                    filteredProducts.length ===
                                    1
                                        ? "piece"
                                        : "pieces"
                                }

                            </span>

                        </div>

                    </div>


                    {/* ==================================================
                        PRODUCT GRID
                    ================================================== */}

                    {filteredProducts.length >
                    0 ? (

                        <div className="collection-product-grid">


                            {filteredProducts.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <Link
                                        to={`/product/${item._id}`}

                                        key={
                                            item._id ||
                                            index
                                        }

                                        className="collection-product-card"
                                    >


                                        {/* ================================
                                            IMAGE
                                        ================================= */}

                                        <div className="collection-image-wrapper">


                                            {Array.isArray(
                                                item.image
                                            ) &&
                                            item.image
                                                .length >
                                                0 ? (

                                                <img
                                                    src={
                                                        item.image[0]
                                                    }

                                                    alt={
                                                        item.name ||
                                                        "Product"
                                                    }

                                                    className="collection-product-image"
                                                />

                                            ) : (

                                                <div className="collection-no-image">

                                                    NO IMAGE

                                                </div>

                                            )}


                                            {/* PRODUCT NUMBER */}

                                            <span className="product-number">

                                                {String(
                                                    index +
                                                    1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}

                                            </span>


                                            {/* VIEW PRODUCT */}

                                            <span className="product-view">

                                                VIEW PRODUCT

                                            </span>

                                        </div>


                                        {/* ================================
                                            PRODUCT INFO
                                        ================================= */}

                                        <div className="collection-product-info">


                                            <div>

                                                <h3>

                                                    {
                                                        item.name
                                                    }

                                                </h3>


                                                <p>

                                                    {
                                                        item.subCategory ||
                                                        item.subcategory ||
                                                        item.category ||
                                                        "Collection"
                                                    }

                                                </p>

                                            </div>


                                            <strong>

                                                {
                                                    currency
                                                }

                                                {
                                                    item.price
                                                }

                                            </strong>

                                        </div>

                                    </Link>

                                )
                            )}

                        </div>

                    ) : (


                        /* ==================================================
                            EMPTY COLLECTION
                        ================================================== */

                        <div className="collection-empty">


                            <div className="empty-icon">

                                {selectedCategory ===
                                "Footwear"
                                    ? "👟"

                                    : selectedCategory ===
                                      "Perfume"
                                    ? "🌸"

                                    : selectedCategory ===
                                      "Grocery"
                                    ? "🛒"

                                    : selectedCategory ===
                                      "Watch"
                                    ? "⌚"

                                    : "✦"}

                            </div>


                            <p>
                                NO PRODUCTS FOUND
                            </p>


                            <h2>
                                Nothing here yet.
                            </h2>


                            <span>

                                {selectedCategory ===
                                "Footwear"

                                    ? "Add footwear products from your admin panel with category set to Footwear or Shoes."

                                    : selectedCategory ===
                                      "Watch"

                                    ? "No watch products were found. Make sure the product category is set to Watch."

                                    : "Try another category or clear your current filter."}

                            </span>


                            <button
                                type="button"

                                onClick={
                                    clearFilters
                                }
                            >

                                VIEW ALL COLLECTIONS

                            </button>

                        </div>

                    )}

                </div>

            </section>

        </main>

    );

};


export default Collection;