import express from "express";
import dotenv from "dotenv";
import connection from "./config/db.js";
import morgan from "morgan";
import colors from "colors";
import cors from "cors";
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";

import orderRoutes from "./routes/order.route.js";

// express initialization
const app = express();

// configuration
dotenv.config();
const PORT = process.env.PORT || 8100;


//start the connection
connection();

//middlewares
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));

app.use(express.json());
app.use(morgan());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(process.env.API_VERSION,userRoutes);
app.use(process.env.API_VERSION,productRoutes);

app.use(process.env.API_VERSION,orderRoutes);

//get method
app.get("/fetch-something",(req,res) =>{
    res.send("your output has some content");
});

// PORT listening

app.listen(PORT,() =>{
    console.log(colors.bgYellow(`The server is running on port no:${PORT}`));
});