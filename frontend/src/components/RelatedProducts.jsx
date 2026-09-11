import React, {
  useContext,
  useEffect,
  useState
} from "react";

import { useNavigate } from "react-router-dom";

import { ShopContext } from "../context/ShopContext";

import ProductItem from "./ProductItem";

import "./css/RelatedProducts.css";

const RelatedProducts = ({
  category,
  subCategory,
  currentProductId
}) => {

  // ==========================================
  // CONTEXT
  // ==========================================

  const {
    products,
    getRelatedProducts
  } = useContext(ShopContext);

  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [
    relatedProducts,
    setRelatedProducts
  ] = useState([]);

  // ==========================================
  // GET RELATED PRODUCTS
  // ==========================================

  useEffect(() => {

    if (
      !products ||
      products.length === 0
    ) {
      setRelatedProducts([]);
      return;
    }

    let related = [];

    // ------------------------------------------
    // FIRST PRIORITY
    // Same category + same sub category
    // ------------------------------------------

    const sameCategoryAndSubCategory =
      products.filter((item) => {

        if (
          item._id === currentProductId
        ) {
          return false;
        }

        return (
          item.category === category &&
          item.subCategory === subCategory
        );

      });

    related = [
      ...sameCategoryAndSubCategory
    ];

    // ------------------------------------------
    // SECOND PRIORITY
    // Same category
    // ------------------------------------------

    if (related.length < 5) {

      const sameCategory =
        products.filter((item) => {

          if (
            item._id === currentProductId
          ) {
            return false;
          }

          if (
            related.some(
              (product) =>
                product._id === item._id
            )
          ) {
            return false;
          }

          return (
            item.category === category
          );

        });

      related = [
        ...related,
        ...sameCategory
      ];
    }

    // ------------------------------------------
    // THIRD PRIORITY
    // Same sub category
    // ------------------------------------------

    if (related.length < 5) {

      const sameSubCategory =
        products.filter((item) => {

          if (
            item._id === currentProductId
          ) {
            return false;
          }

          if (
            related.some(
              (product) =>
                product._id === item._id
            )
          ) {
            return false;
          }

          return (
            item.subCategory === subCategory
          );

        });

      related = [
        ...related,
        ...sameSubCategory
      ];
    }

    // ------------------------------------------
    // FINAL FALLBACK
    // Any other products
    // ------------------------------------------

    if (related.length < 5) {

      const otherProducts =
        products.filter((item) => {

          if (
            item._id === currentProductId
          ) {
            return false;
          }

          if (
            related.some(
              (product) =>
                product._id === item._id
            )
          ) {
            return false;
          }

          return true;

        });

      related = [
        ...related,
        ...otherProducts
      ];
    }

    // ------------------------------------------
    // REMOVE DUPLICATES
    // ------------------------------------------

    const uniqueProducts =
      related.filter(
        (product, index, self) =>
          index ===
          self.findIndex(
            (item) =>
              item._id === product._id
          )
      );

    // ------------------------------------------
    // LIMIT
    // ------------------------------------------

    setRelatedProducts(
      uniqueProducts.slice(0, 5)
    );

  }, [
    products,
    category,
    subCategory,
    currentProductId,
    getRelatedProducts
  ]);

  // ==========================================
  // DON'T SHOW EMPTY SECTION
  // ==========================================

  if (
    relatedProducts.length === 0
  ) {
    return null;
  }

  // ==========================================
  // VIEW ALL
  // ==========================================

  const handleViewAll = () => {

    navigate(
      `/collection?category=${category}`
    );

  };

  // ==========================================
  // JSX
  // ==========================================

  return (

    <section className="related-products">

      {/* ======================================
          SECTION INTRO
      ====================================== */}

      <div className="related-products-header">

        {/* Small label */}

        <div className="related-products-eyebrow">

          <span></span>

          <p>
            CURATED FOR YOU
          </p>

          <span></span>

        </div>

        {/* Main title */}

        <h2 className="related-products-title">

          You May Also Like

        </h2>

        {/* Description */}

        <p className="related-products-description">

          Discover pieces selected to complement
          your style and complete your collection.

        </p>

      </div>


      {/* ======================================
          PRODUCT AREA
      ====================================== */}

      <div className="related-products-wrapper">

        {/* Top decorative line */}

        <div className="related-products-top-line">

          <span>
            RELATED COLLECTION
          </span>

          <span>
            {String(
              relatedProducts.length
            ).padStart(2, "0")}{" "}
            PIECES
          </span>

        </div>


        {/* ====================================
            PRODUCT GRID
        ==================================== */}

        <div className="related-products-grid">

          {relatedProducts.map(
            (item, index) => (

              <article
                className="related-product-card"
                key={item._id}
              >

                {/* Product number */}

                <div className="related-product-number">

                  {String(
                    index + 1
                  ).padStart(2, "0")}

                </div>


                {/* Product image/card */}

                <div className="related-product-image">

                  <ProductItem
                    id={item._id}
                    image={item.image}
                    name={item.name}
                    price={item.price}
                  />

                </div>


                {/* Hover view button */}

                <button
                  type="button"
                  className="related-product-view"
                  onClick={() =>
                    navigate(
                      `/product/${item._id}`
                    )
                  }
                >

                  <span>
                    VIEW PRODUCT
                  </span>

                  <span className="related-product-arrow">
                    →
                  </span>

                </button>

              </article>

            )
          )}

        </div>


        {/* ====================================
            BOTTOM ACTION
        ==================================== */}

        <div className="related-products-footer">

          <div className="related-products-footer-line"></div>

          <button
            type="button"
            className="related-products-view-all"
            onClick={handleViewAll}
          >

            <span>
              EXPLORE COLLECTION
            </span>

            <span className="related-products-button-arrow">
              →
            </span>

          </button>

          <div className="related-products-footer-line"></div>

        </div>

      </div>

    </section>

  );
};

export default RelatedProducts;