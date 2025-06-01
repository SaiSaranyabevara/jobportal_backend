import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongo db connected successfully");

    } catch (error) {
        console.log("mongo db connection failed", error.message);
    }
}

export default connectDb;