import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

const emptyForm = {
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    category: "Footwear",
    subCategory: "Shoes",
    gender: "Unisex",
    type: "",
    sizes: [],
    bestSeller: false,
    images: [null, null, null, null],
};

const categoryOptions = [
    "Footwear",
    "Clothing",
    "Accessories",
];

const footwearTypes = [
    "Shoes",
    "Sneakers",
    "Sandals",
    "Heels",
    "Boots",
    "Slippers",
    "Running Shoes",
    "Lifestyle Shoes",
];

const sizeOptions = ["5", "6", "7", "8", "9", "10", "11", "12"];

const Add = () => {
    const { addProduct } = useContext(AdminContext);
    const navigate = useNavigate();

    const [form, setForm] = useState(emptyForm);
    const [previews, setPreviews] = useState([
        null,
        null,
        null,
        null,
    ]);
    const [busy, setBusy] = useState(false);
    const inputRefs = useRef([]);

    const isFootwear =
        String(form.category).toLowerCase() === "footwear";

    const update = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleImage = (index, file) => {
        if (!file) return;

        setForm((prev) => {
            const images = [...prev.images];
            images[index] = file;
            return { ...prev, images };
        });

        setPreviews((prev) => {
            const next = [...prev];
            next[index] = URL.createObjectURL(file);
            return next;
        });
    };

    const toggleSize = (size) => {
        setForm((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter((item) => item !== size)
                : [...prev.sizes, size],
        }));
    };

    const submit = async (event) => {
        event.preventDefault();

        if (!form.name.trim()) {
            alert("Please enter product name.");
            return;
        }

        if (!form.description.trim()) {
            alert("Please enter product description.");
            return;
        }

        if (!form.price || Number(form.price) <= 0) {
            alert("Please enter a valid price.");
            return;
        }

        if (form.sizes.length === 0) {
            alert("Please select at least one size.");
            return;
        }

        if (!form.images.some(Boolean)) {
            alert("Please select at least one product image.");
            return;
        }

        setBusy(true);

        try {
            const success = await addProduct(form);

            if (success) {
                setForm(emptyForm);
                setPreviews([null, null, null, null]);
                navigate("/list");
            }
        } finally {
            setBusy(false);
        }
    };

    return (
        <section className="p-5 sm:p-7 lg:p-10">
            <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-2">
                    Product Management
                </p>
                <h1 className="text-3xl sm:text-4xl font-semibold">
                    Add Items
                </h1>
                <p className="text-gray-500 mt-2">
                    Add a new product to your store.
                </p>
            </div>

            <form onSubmit={submit} className="max-w-5xl">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 space-y-8">
                    <div>
                        <h2 className="font-semibold mb-4">
                            Product Images
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {previews.map((preview, index) => (
                                <button
                                    type="button"
                                    key={index}
                                    onClick={() =>
                                        inputRefs.current[index]?.click()
                                    }
                                    className="aspect-square border border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 hover:border-black transition"
                                >
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-3xl text-gray-400">
                                            +
                                        </span>
                                    )}

                                    <input
                                        ref={(el) =>
                                            (inputRefs.current[index] = el)
                                        }
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) =>
                                            handleImage(
                                                index,
                                                e.target.files?.[0]
                                            )
                                        }
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Product Name
                            </label>
                            <input
                                value={form.name}
                                onChange={(e) =>
                                    update("name", e.target.value)
                                }
                                placeholder="Enter product name"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                                required
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Description
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) =>
                                    update(
                                        "description",
                                        e.target.value
                                    )
                                }
                                placeholder="Describe the product"
                                rows={5}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black resize-y"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Price
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={form.price}
                                onChange={(e) =>
                                    update("price", e.target.value)
                                }
                                placeholder="₹ 0"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Old Price
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={form.oldPrice}
                                onChange={(e) =>
                                    update("oldPrice", e.target.value)
                                }
                                placeholder="Optional"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Category
                            </label>
                            <select
                                value={form.category}
                                onChange={(e) => {
                                    const category = e.target.value;

                                    setForm((prev) => ({
                                        ...prev,
                                        category,
                                        subCategory:
                                            category === "Footwear"
                                                ? "Shoes"
                                                : "",
                                        type: "",
                                    }));
                                }}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black bg-white"
                            >
                                {categoryOptions.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Sub Category
                            </label>

                            {isFootwear ? (
                                <select
                                    value={form.subCategory}
                                    onChange={(e) =>
                                        update(
                                            "subCategory",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black bg-white"
                                >
                                    {footwearTypes.map((item) => (
                                        <option key={item}>{item}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    value={form.subCategory}
                                    onChange={(e) =>
                                        update(
                                            "subCategory",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Sub category"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Gender
                            </label>
                            <select
                                value={form.gender}
                                onChange={(e) =>
                                    update("gender", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black bg-white"
                            >
                                <option>Unisex</option>
                                <option>Men</option>
                                <option>Women</option>
                                <option>Kids</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Product Type
                            </label>
                            <input
                                value={form.type}
                                onChange={(e) =>
                                    update("type", e.target.value)
                                }
                                placeholder="Optional"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    <div>
                        <h2 className="font-semibold mb-3">
                            Available Sizes
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {sizeOptions.map((size) => {
                                const active =
                                    form.sizes.includes(size);

                                return (
                                    <button
                                        type="button"
                                        key={size}
                                        onClick={() =>
                                            toggleSize(size)
                                        }
                                        className={[
                                            "px-4 py-2 rounded-lg border text-sm transition",
                                            active
                                                ? "bg-black text-white border-black"
                                                : "border-gray-300 hover:border-black",
                                        ].join(" ")}
                                    >
                                        {size}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.bestSeller}
                            onChange={(e) =>
                                update(
                                    "bestSeller",
                                    e.target.checked
                                )
                            }
                            className="w-4 h-4"
                        />
                        <span className="text-sm">
                            Mark as Bestseller
                        </span>
                    </label>

                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate("/list")}
                            className="px-6 py-3 rounded-xl border border-gray-300 text-sm hover:border-black transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={busy}
                            className="px-7 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                        >
                            {busy ? "ADDING..." : "ADD PRODUCT"}
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default Add;
