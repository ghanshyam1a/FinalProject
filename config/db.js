// import mongoose from "mongoose";
// import colors from "colors";

// const connection = async() =>{
//     try {
//         const connectionString = process.env.MONGO_URI;
//         const connectDB = await mongoose.connect(`${connectionString}`);

//         connectDB?
//         console.log(colors.bgYellow(`Database has connected successfully`)):
//         console.log(colors.bgYellow(`Database did not connect!!`));
//     } catch (err) {
//         console.log(err.message);
//     }
// };

// export default connection;

//import mongoose, { connection, mongo } from "mongoose";
import mongoose from "mongoose";
import colors from "colors";

import dotenv from "dotenv";
dotenv.config();

let isConnected = null;

const connection = async() =>{
    if(isConnected){
        console.log(colors.bgGreen("Using existing DB connection"));
        return;
    }

    try {

        console.log("Connection string",process.env.MONGO_URI);
        const connectionString = process.env.MONGO_URI;
        const connectDB = await mongoose.connect(`${connectionString}`);

        console.log(connectDB);
        console.log(connectDB.connections);

        isConnected = connectDB.connections[0].readyState;
        console.log(colors.magenta("Successfully Created a new connection"));

    } catch (err) {
        console.error(colors.bgRed(`DB connection failled: ${err.message}`));
        throw new Error ("Database connection failled");
    }
};

export default connection;