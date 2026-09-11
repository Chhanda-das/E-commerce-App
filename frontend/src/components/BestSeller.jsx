import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

import "./css/BestSeller.css";

const BestSeller = () => {

  const { products } =
    useContext(ShopContext);

  const [
    bestSeller,
    setBestSeller,
  ] = useState([]);

  useEffect(() => {

    const bestProduct =
      products.filter(
        (item) =>
          item.bestseller
      );

    setBestSeller(
      bestProduct.slice(0, 5)
    );

  }, [products]);

  return (
    <section className="best-seller">

      {/* ============================== */}
      {/* SECTION HEADER */}
      {/* ============================== */}

      <div className="best-seller-header">

        <div className="best-seller-heading-row">

          <span className="best-seller-heading-line"></span>

          <div className="best-seller-title">
            <Title
              text1="BEST"
              text2="SELLERS"
            />
          </div>

          <span className="best-seller-heading-line"></span>

        </div>


        <p className="best-seller-description">
          Discover the pieces everyone is
          loving right now. Timeless styles,
          modern details and effortless
          everyday elegance.
        </p>


        <div className="best-seller-divider"></div>

      </div>


      {/* ============================== */}
      {/* BEST SELLER PRODUCTS */}
      {/* ============================== */}

      <div className="best-seller-products">

        {bestSeller.map(
          (item, index) => (

            <div
              className="best-seller-product"
              key={index}
            >

              {/* Product Number */}
              <span className="best-seller-number">
                {String(index + 1).padStart(2, "0")}
              </span>


              {/* Product */}
              <div className="best-seller-product-inner">

                <ProductItem
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                />

              </div>

            </div>

          )
        )}

      </div>

    </section>
  );
};

export default BestSeller;