import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import uploadRouter from './route/upload.router.js';
import categoryRouter from './route/category.route.js';
import subCategoryRouter from './route/subCategory.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import addressRouter from './route/address.route.js';
import orderRouter from './route/order.route.js';
import Adminrouter from './route/admin.route.js';
import analyticsRouter from './route/analytics.js';

const app = express();

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'https://nepmandi-frontend.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy blocked this origin: ' + origin), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));
app.use(helmet({ crossOriginResourcePolicy: false }));

const PORT = process.env.PORT || 8080;

//  Routes
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use('/api/order', orderRouter);
app.use('/api/admin', Adminrouter);
app.use('/api/admin/analytics', analyticsRouter);

//  DB + Server start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
});
