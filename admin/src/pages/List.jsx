import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend URL
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // ==========================================
  // FETCH ALL PRODUCTS
  // ==========================================

  const fetchList = async () => {
    try {
      setLoading(true);

      console.log("BACKEND URL:", backendUrl);
      console.log("GETTING PRODUCTS...");

      const response = await axios.get(
        `${backendUrl}/api/product/list`
      );

      console.log("API RESPONSE:", response.data);

      if (response.data.success) {
        setList(response.data.products);

        console.log(
          "PRODUCTS RECEIVED:",
          response.data.products.length
        );
      } else {
        toast.error(
          response.data.message || "Failed to get products"
        );
      }
    } catch (error) {
      console.log("FETCH PRODUCT ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // REMOVE PRODUCT
  // ==========================================

  const removeProduct = async (id) => {
    try {
      if (!id) {
        toast.error("Product ID missing");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        {
          headers: {
            token: token || "",
          },
        }
      );

      console.log("REMOVE RESPONSE:", response.data);

      if (response.data.success) {
        toast.success(response.data.message);

        // Refresh list
        fetchList();
      } else {
        toast.error(
          response.data.message || "Failed to remove product"
        );
      }
    } catch (error) {
      console.log("REMOVE PRODUCT ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to remove product"
      );
    }
  };

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {
    fetchList();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="w-full">
        <p className="mb-4 text-xl font-semibold">
          All Products List
        </p>

        <div className="py-10 text-center text-gray-500">
          Loading products...
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="w-full">

      {/* ======================================
          HEADING
      ====================================== */}

      <div className="flex items-center justify-between mb-5">
        <p className="text-xl font-semibold">
          All Products List
        </p>

        <p className="text-sm text-gray-500">
          Total Products: {list.length}
        </p>
      </div>

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="hidden md:grid grid-cols-[80px_3fr_1.5fr_1fr_80px] items-center py-3 px-4 bg-gray-100 border text-sm font-semibold">
        <p>Image</p>
        <p>Name</p>
        <p>Category</p>
        <p>Price</p>
        <p className="text-center">
          Action
        </p>
      </div>

      {/* ======================================
          NO PRODUCTS
      ====================================== */}

      {list.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          No products found
        </div>
      ) : (

        /* ====================================
           PRODUCT LIST
        ==================================== */

        <div className="border-l border-r">

          {list.map((item) => (

            <div
              key={item._id}
              className="grid grid-cols-[80px_3fr_1.5fr_1fr_80px] items-center gap-2 py-4 px-4 border-b text-sm hover:bg-gray-50"
            >

              {/* ==============================
                  IMAGE
              ============================== */}

              <div>
                {item.image &&
                item.image.length > 0 ? (

                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded border"
                  />

                ) : (

                  <div className="w-14 h-14 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                    No Image
                  </div>

                )}
              </div>

              {/* ==============================
                  NAME
              ============================== */}

              <p className="font-medium truncate">
                {item.name}
              </p>

              {/* ==============================
                  CATEGORY
              ============================== */}

              <div>
                <p>
                  {item.category}
                </p>

                {item.subCategory && (
                  <p className="text-xs text-gray-400">
                    {item.subCategory}
                  </p>
                )}
              </div>

              {/* ==============================
                  PRICE
              ============================== */}

              <p>
                ₹{item.price}
              </p>

              {/* ==============================
                  REMOVE
              ============================== */}

              <div className="text-center">

                <button
                  onClick={() =>
                    removeProduct(item._id)
                  }
                  className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                >
                  X
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default List;