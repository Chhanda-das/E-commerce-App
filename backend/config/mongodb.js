import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB Connected");
    });

    await mongoose.connect(
      `${process.env.MONGODB_URI}/e-commerce`
    );
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);
  }
};

export default connectDB;