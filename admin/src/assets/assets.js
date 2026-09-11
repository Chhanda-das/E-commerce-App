import logo from "./logo.png";
import hero_img from "./hero_img.png";
import order_icon from "./order_icon.png";
import upload_area from "./upload_area.png";

export const assets = {
  logo,
  hero_img,
  order_icon,
  upload_area,
};

export const products = [
  {
    _id: "1",
    name: "Women Round Neck Cotton Top",
    description: "Comfortable cotton top",
    price: 100,
    image: [hero_img],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: 1716634345448,
    bestseller: true,
  },

  {
    _id: "2",
    name: "Men Casual Shirt",
    description: "Comfortable cotton shirt",
    price: 150,
    image: [hero_img],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345449,
    bestseller: false,
  },

  {
    _id: "3",
    name: "Kids T-Shirt",
    description: "Soft cotton T-shirt",
    price: 80,
    image: [hero_img],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["4Y", "6Y", "8Y"],
    date: 1716634345450,
    bestseller: true,
  },

  {
    _id: "4",
    name: "Women's Hoodie",
    description: "Warm hoodie",
    price: 250,
    image: [hero_img],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L"],
    date: 1716634345451,
    bestseller: false,
  },

  {
    _id: "5",
    name: "Denim Jacket",
    description: "Classic denim jacket",
    price: 350,
    image: [hero_img],
    category: "Men",
    subCategory: "Jackets",
    sizes: ["M", "L", "XL"],
    date: 1716634345452,
    bestseller: true,
  },
];