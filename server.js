import express from "express";
import dotenv from "dotenv";
import connection from "./config/db.js";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import orderRoutes from "./routes/order.route.js";
import cookieParser from 'cookie-parser';


// express initialization
const app = express();

// configuration
dotenv.config();

//const PORT = process.env.PORT || 8100;

// Connect db
//connectDB();

//start the connection
connection();

//middlewares
app.use(
    cors({
       origin:"http://localhost:5173",
       credentials:true,
      })
    );

app.use(async(req,res,next) =>{
    try {
        await connection();
        next();
    } catch (err) {
        next(err);
    }
});

app.use(express.json());
app.use(morgan());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// DB connection middleware (ensure DB is connected before router)



app.use(process.env.API_VERSION,userRoutes);
app.use(process.env.API_VERSION,productRoutes);
app.use(process.env.API_VERSION,orderRoutes);

// Error handling middleware

app.use((error,req,res,next) =>{
    if(error instanceof MulterError){
        if(error.code === "LIMIT_FILE_SIZE"){
            res.status(400).json({
                success:false,
                message:"The file is too large",
                err:err.message,
            });
        }

        if(error.code === "LIMIT_FILE_COUNT"){
            res.status(400).json({
                success:false,
                message:"Too many files",
                err:err.message,
            });
        }
    }
});

//test get method
app.get("/fetch-something",(req,res) =>{
    res.send("your output has some content");
});

export default app;

//module.exports = app;

