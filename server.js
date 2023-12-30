import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

//configer env
dotenv.config();
//psmodule fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//rest object in express
const app = express();

//middelware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client/build')))

//all routes in hear
app.use('/api/v1/auth', authRoutes);
//category routess
app.use('/api/v1/category', categoryRoutes);
//product routes
app.use('/api/v1/product', productRoutes);

//rest api
// app.get('/', (req, res) => {
//     res.send("<h1> Welcome to ecommerce app </h1>");
// });
app.use('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
    console.log(`Server Running ${process.env.DEV_MODE} mode on ${PORT}`.bgCyan.white);
})

//connect mongodb
connectDb();
