import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './utils/db.js';
import userRoute from './routes/user.route.js';
import companyRoute from './routes/company.route.js';
import jobRoute from './routes/job.route.js';
import applicationRoute from './routes/application.route.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "https://jobportal-frontend-green.vercel.app",
  credentials: true
};
app.use(cors(corsOptions));

// API routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/company', companyRoute);
app.use('/api/v1/job', jobRoute);
app.use('/api/v1/application', applicationRoute);

// Start server only after MongoDB is connected
connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
  });





// import express, { response } from 'express';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';

// const app=express();
// import dotenv from 'dotenv';
// import connectDb from './utils/db.js';
// import userRoute from './routes/user.route.js';
// import companyRoute from './routes/company.route.js';
// import jobRoute from './routes/job.route.js';
// import applicationRoute from './routes/application.route.js';
// dotenv.config();


// // app.get('/home',(req,res)=>{
// //     return res.status(200).json({message:"hello world",success:true});
// // })

// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// app.use(cookieParser());
// const corsOptions=({
//    origin:
//   "https://jobportal-frontend-green.vercel.app"
//     ,
//     credentials:true
// });
// app.use(cors(corsOptions));

// const port=process.env.PORT || 3000;

// //api's 
// app.use('/api/v1/user',userRoute);
// app.use('/api/v1/company',companyRoute);
// app.use('/api/v1/job',jobRoute);
// app.use('/api/v1/application',applicationRoute);

// app.listen(port,()=>{
//     connectDb();
//     console.log(`server running at port ${port}`);


// })









// // 77veaqH6UlR0UIu1
