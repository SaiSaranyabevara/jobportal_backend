import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error; // This is important to prevent the app from starting without DB
  }
};

export default connectDb;




// import mongoose from "mongoose";

// const connectDb = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("mongo db connected successfully");

//     } catch (error) {
//         console.log("mongo db connection failed", error.message);
//     }
// }

// export default connectDb;
