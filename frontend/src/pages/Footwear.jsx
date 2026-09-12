import React, {
    useContext,
    useMemo,
    useState,
} from "react";

import { Link } from "react-router-dom";

import { ShopContext } from "../context/ShopContext";

import "../components/css/Collection.css";

// ======================================================
// FOOTWEAR PAGE
// ======================================================

const Footwear = () => {

    const {
        products,
        currency,
    } = useContext(ShopContext);

    const [selectedCategory, setSelectedCategory] =
        useState("All");

    const [search, setSearch] =
        useState("");

    // ======================================================
    // BACKEND URL
    // ======================================================

    const backendUrl =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:5000";

    // ======================================================
    // FOOTWEAR CATEGORIES
    // ======================================================

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

    // ======================================================
    // IMAGE URL
    // ======================================================

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }

        const value =
            String(image).trim();

        if (!value) {
            return "";
        }

        // Full URL
        if (
            value.startsWith("http://") ||
            value.startsWith("https://")
        ) {
            return value;
        }

        // Old frontend asset path
        if (
            value.startsWith("src/assets/")
        ) {
            return value;
        }

        // Backend uploaded image
        const fileName =
            value
                .split("/")
                .pop()
                .trim();

        return `${backendUrl}/images/${encodeURIComponent(
            fileName
        )}`;
    };

    // ======================================================
    // FOOTWEAR PRODUCTS FROM DATABASE
    // ======================================================

    const footwearProducts = useMemo(() => {

        if (!Array.isArray(products)) {
            return [];
        }

        let result =
            products.filter((product) => {

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

                return (
                    category === "footwear" ||
                    category === "shoes" ||
                    category === "shoe" ||
                    subCategory === "footwear" ||
                    subCategory === "shoes" ||
                    subCategory === "shoe" ||
                    type === "footwear" ||
                    type === "shoes" ||
                    type === "shoe"
                );
            });

        // ==================================================
        // SEARCH
        // ==================================================

        if (search.trim()) {

            const searchText =
                search
                    .trim()
                    .toLowerCase();

            result =
                result.filter(
                    (product) => {

                        const name =
                            String(
                                product.name ||
                                ""
                            ).toLowerCase();

                        const description =
                            String(
                                product.description ||
                                ""
                            ).toLowerCase();

                        const subCategory =
                            String(
                                product.subCategory ||
                                ""
                            ).toLowerCase();

                        const productType =
                            String(
                                product.productType ||
                                product.type ||
                                ""
                            ).toLowerCase();

                        return (
                            name.includes(
                                searchText
                            ) ||
                            description.includes(
                                searchText
                            ) ||
                            subCategory.includes(
                                searchText
                            ) ||
                            productType.includes(
                                searchText
                            )
                        );
                    }
                );
        }

        // ==================================================
        // CATEGORY FILTER
        // ==================================================

        if (
            selectedCategory !== "All"
        ) {

            const selected =
                selectedCategory
                    .toLowerCase()
                    .trim();

            result =
                result.filter(
                    (product) => {

                        const category =
                            String(
                                product.category ||
                                ""
                            )
                                .toLowerCase()
                                .trim();

                        const subCategory =
                            String(
                                product.subCategory ||
                                ""
                            )
                                .toLowerCase()
                                .trim();

                        const type =
                            String(
                                product.productType ||
                                product.type ||
                                ""
                            )
                                .toLowerCase()
                                .trim();

                        return (
                            category === selected ||
                            subCategory === selected ||
                            type === selected
                        );
                    }
                );
        }

        return result;

    }, [
        products,
        selectedCategory,
        search,
    ]);

    // ======================================================
    // FORMAT PRICE
    // ======================================================

    const formatPrice = (price) => {

        return Number(
            price || 0
        ).toLocaleString("en-IN");

    };

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <main className="collection-page">

            {/* ==========================================
                HEADER
            ========================================== */}

            <section className="collection-heading">

                <div>

                    <p className="collection-eyebrow">
                        THE FOREVER EDIT · FOOTWEAR
                    </p>

                    <h1>
                        Footwear
                        <span>
                            {" "}Collection
                        </span>
                    </h1>

                    <p className="collection-subtitle">
                        Explore shoes, sneakers,
                        sandals, boots and more.
                    </p>

                </div>

                <div className="collection-total">

                    <span>
                        SHOWING
                    </span>

                    <strong>
                        {String(
                            footwearProducts.length
                        ).padStart(2, "0")}
                    </strong>

                </div>

            </section>

            {/* ==========================================
                FILTER AREA
            ========================================== */}

            <section className="collection-layout">

                <aside className="collection-filter">

                    <div className="filter-top">

                        <div>

                            <p className="filter-label">
                                REFINE
                            </p>

                            <h2>
                                Footwear
                            </h2>

                        </div>

                        <span className="filter-star">
                            ✦
                        </span>

                    </div>

                    {/* SEARCH */}

                    <div className="filter-section">

                        <div className="filter-section-title">
                            <span>
                                SEARCH
                            </span>
                        </div>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search footwear..."
                            className="w-full border-b border-gray-300 py-3 outline-none"
                        />

                    </div>

                    {/* CATEGORIES */}

                    <div className="filter-section">

                        <div className="filter-section-title">

                            <span>
                                CATEGORY
                            </span>

                        </div>

                        <div className="category-list">

                            {categories.map(
                                (category) => (

                                    <button
                                        key={category}
                                        type="button"
                                        className={`category-button ${
                                            selectedCategory ===
                                            category
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedCategory(
                                                category
                                            )
                                        }
                                    >

                                        <span className="category-icon">
                                            👟
                                        </span>

                                        <span>
                                            {category}
                                        </span>

                                    </button>

                                )
                            )}

                        </div>

                    </div>

                </aside>

                {/* ==========================================
                    PRODUCTS
                ========================================== */}

                <div className="collection-products-area">

                    <div className="products-topbar">

                        <div>

                            <p>
                                {
                                    selectedCategory ===
                                    "All"
                                        ? "ALL FOOTWEAR"
                                        : `${selectedCategory.toUpperCase()}`
                                }
                            </p>

                            <span>
                                {
                                    footwearProducts.length
                                }{" "}
                                {
                                    footwearProducts.length ===
                                    1
                                        ? "piece"
                                        : "pieces"
                                }
                            </span>

                        </div>

                    </div>

                    {/* ==========================================
                        PRODUCT GRID
                    ========================================== */}

                    {footwearProducts.length >
                    0 ? (

                        <div className="collection-product-grid">

                            {footwearProducts.map(
                                (
                                    item,
                                    index
                                ) => {

                                    const image =
                                        Array.isArray(
                                            item.image
                                        )
                                            ? item.image[0]
                                            : item.image;

                                    return (

                                        <Link
                                            key={
                                                item._id ||
                                                index
                                            }
                                            to={`/product/${item._id}`}
                                            className="collection-product-card"
                                        >

                                            {/* IMAGE */}

                                            <div className="collection-image-wrapper">

                                                {image ? (

                                                    <img
                                                        src={
                                                            getImageUrl(
                                                                image
                                                            )
                                                        }
                                                        alt={
                                                            item.name ||
                                                            "Product"
                                                        }
                                                        className="collection-product-image"
                                                        onError={(
                                                            event
                                                        ) => {
                                                            event.currentTarget.style.display =
                                                                "none";
                                                        }}
                                                    />

                                                ) : (

                                                    <div className="collection-no-image">
                                                        NO IMAGE
                                                    </div>

                                                )}

                                                <span className="product-number">
                                                    {String(
                                                        index +
                                                        1
                                                    ).padStart(
                                                        2,
                                                        "0"
                                                    )}
                                                </span>

                                                <span className="product-view">
                                                    VIEW PRODUCT
                                                </span>

                                            </div>

                                            {/* INFO */}

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
                                                            item.productType ||
                                                            item.category ||
                                                            "Footwear"
                                                        }
                                                    </p>

                                                </div>

                                                <strong>
                                                    {currency}
                                                    {formatPrice(
                                                        item.price
                                                    )}
                                                </strong>

                                            </div>

                                        </Link>

                                    );
                                }
                            )}

                        </div>

                    ) : (

                        <div className="collection-empty">

                            <div className="empty-icon">
                                👟
                            </div>

                            <p>
                                NO FOOTWEAR FOUND
                            </p>

                            <h2>
                                No footwear products yet.
                            </h2>

                            <span>
                                Add products from the
                                Admin Panel with
                                Category set to
                                Footwear.
                            </span>

                        </div>

                    )}

                </div>

            </section>

        </main>
    );
};

export default Footwear;