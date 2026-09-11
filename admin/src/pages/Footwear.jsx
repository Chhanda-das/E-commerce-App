import React, {
  useContext,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  AdminContext,
} from "../context/AdminContext";


const Footwear = () => {

  const {
    backendUrl,
    products,
    getProducts,
    token,
  } = useContext(AdminContext);


  const [selectedType, setSelectedType] =
    useState("All");


  const [search, setSearch] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // FOOTWEAR FILTER
  // =====================================================

  const footwearProducts = useMemo(() => {

    if (!Array.isArray(products)) {
      return [];
    }

    return products.filter(
      (product) => {

        const category =
          String(
            product.category || ""
          ).trim().toLowerCase();

        return category === "footwear";

      }
    );

  }, [products]);


  // =====================================================
  // TYPES
  // =====================================================

  const footwearTypes = [
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
  // FINAL PRODUCTS
  // =====================================================

  const filteredProducts =
    footwearProducts.filter(
      (product) => {

        const matchesType =
          selectedType === "All" ||
          String(
            product.subCategory || ""
          ).toLowerCase() ===
            selectedType.toLowerCase();


        const matchesSearch =
          String(
            product.name || ""
          )
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );


        return (
          matchesType &&
          matchesSearch
        );

      }
    );


  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const removeProduct = async (
    productId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to remove this product?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setLoading(true);


      const response =
        await axios.post(

          `${backendUrl}/api/product/remove`,

          {
            id: productId,
          },

          {
            headers: {
              token: token,
            },
          }

        );


      if (response.data.success) {

        await getProducts();

      } else {

        alert(
          response.data.message ||
          "Failed to remove product"
        );

      }

    } catch (error) {

      console.error(
        "REMOVE PRODUCT ERROR:",
        error
      );


      alert(
        error.response?.data?.message ||
        "Failed to remove product"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // IMAGE
  // =====================================================

  const getProductImage = (
    product
  ) => {

    if (
      Array.isArray(product.image) &&
      product.image.length > 0
    ) {

      return product.image[0];

    }

    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {

      return product.images[0];

    }

    return "/placeholder-image.png";

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="
      min-h-screen
      bg-[#fafafa]
      px-5
      sm:px-8
      lg:px-12
      py-8
    ">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="
        flex
        flex-col
        lg:flex-row
        lg:items-end
        lg:justify-between
        gap-6
        mb-8
      ">


        <div>

          <p className="
            text-xs
            uppercase
            tracking-[0.3em]
            text-gray-400
            mb-2
          ">
            Product Management
          </p>

          <h1 className="
            text-3xl
            sm:text-4xl
            font-semibold
            text-gray-900
          ">
            Footwear
          </h1>

          <p className="
            text-gray-500
            mt-2
          ">
            Manage your footwear collection.
          </p>

        </div>


        {/* TOTAL */}

        <div className="
          bg-white
          border
          border-gray-200
          rounded-2xl
          px-8
          py-5
          min-w-[190px]
        ">

          <p className="
            text-xs
            uppercase
            tracking-wider
            text-gray-400
          ">
            Total Footwear
          </p>

          <p className="
            text-4xl
            font-semibold
            mt-1
          ">
            {footwearProducts.length}
          </p>

        </div>


      </div>


      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <div className="
        bg-white
        border
        border-gray-200
        rounded-2xl
        p-5
        mb-6
      ">


        <div className="
          flex
          flex-col
          lg:flex-row
          gap-4
          justify-between
        ">


          {/* SEARCH */}

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search footwear..."
            className="
              w-full
              lg:max-w-sm
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-black
            "
          />


          {/* TYPES */}

          <div className="
            flex
            gap-2
            overflow-x-auto
            pb-1
          ">

            {footwearTypes.map(
              (type) => (

                <button
                  key={type}
                  onClick={() =>
                    setSelectedType(type)
                  }
                  className={`
                    whitespace-nowrap
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                    border
                    transition

                    ${
                      selectedType === type
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border-gray-300 hover:border-black"
                    }
                  `}
                >
                  {type}
                </button>

              )
            )}

          </div>

        </div>

      </div>


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {footwearProducts.length === 0 ? (

        <div className="
          bg-white
          border
          border-gray-200
          rounded-2xl
          min-h-[350px]
          flex
          flex-col
          items-center
          justify-center
          text-center
          px-6
        ">

          <div className="
            text-6xl
            mb-5
          ">
            👟
          </div>

          <h2 className="
            text-2xl
            font-semibold
            text-gray-900
          ">
            No Footwear Products
          </h2>

          <p className="
            text-gray-500
            mt-2
            max-w-md
          ">
            Add a product from Add Items
            and select Footwear as the
            category.
          </p>

        </div>

      ) : filteredProducts.length === 0 ? (

        <div className="
          bg-white
          border
          border-gray-200
          rounded-2xl
          py-20
          text-center
        ">

          <h2 className="
            text-xl
            font-semibold
          ">
            No matching products
          </h2>

          <p className="
            text-gray-500
            mt-2
          ">
            Try another search or product type.
          </p>

        </div>

      ) : (

        /* =================================================
           PRODUCT GRID
        ================================================= */

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-3
          2xl:grid-cols-4
          gap-5
        ">

          {filteredProducts.map(
            (product) => (

              <div
                key={product._id}
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  overflow-hidden
                  group
                  hover:shadow-lg
                  transition
                "
              >


                {/* IMAGE */}

                <div className="
                  aspect-[4/5]
                  bg-gray-100
                  overflow-hidden
                ">

                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-105
                      transition
                      duration-500
                    "
                  />

                </div>


                {/* DETAILS */}

                <div className="p-5">


                  <div className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  ">

                    <div>

                      <h3 className="
                        font-semibold
                        text-gray-900
                        line-clamp-2
                      ">
                        {product.name}
                      </h3>

                      <p className="
                        text-xs
                        text-gray-400
                        mt-1
                      ">
                        {product.subCategory}
                      </p>

                    </div>


                    {product.bestSeller && (

                      <span className="
                        text-[10px]
                        uppercase
                        tracking-wider
                        bg-black
                        text-white
                        px-2
                        py-1
                        rounded
                      ">
                        Bestseller
                      </span>

                    )}

                  </div>


                  {/* PRICE */}

                  <p className="
                    text-lg
                    font-semibold
                    mt-4
                  ">
                    ₹{product.price}
                  </p>


                  {/* SIZES */}

                  <div className="
                    flex
                    flex-wrap
                    gap-1.5
                    mt-3
                  ">

                    {Array.isArray(
                      product.sizes
                    ) &&
                      product.sizes.map(
                        (size) => (

                          <span
                            key={size}
                            className="
                              text-xs
                              border
                              border-gray-200
                              px-2
                              py-1
                              rounded
                              text-gray-600
                            "
                          >
                            {size}
                          </span>

                        )
                      )}

                  </div>


                  {/* DELETE */}

                  <button
                    disabled={loading}
                    onClick={() =>
                      removeProduct(
                        product._id
                      )
                    }
                    className="
                      w-full
                      mt-5
                      border
                      border-red-200
                      text-red-600
                      py-2.5
                      rounded-xl
                      text-sm
                      hover:bg-red-50
                      transition
                    "
                  >
                    Remove Product
                  </button>


                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

};


export default Footwear;