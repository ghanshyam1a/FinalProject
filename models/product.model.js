import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"product name is required"],
        unique:true,
        min:[3,"product name should be minimum 3 characters"],
        trim:true,
    },
    price:{
        type:Number,
        required:true,
        min:[1,"product price should be more than 0"],
        trim:true,
    },
},

    {
        timestamps:true,
    },
);

export default mongoose.model("Product",productSchema);
