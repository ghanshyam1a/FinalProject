import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        uniquie:[true,"Email must be unique"],
        required:[true,"email must be required"],
        trim:true,
        match:[/^[a-zA-Z0-9._%+-]+@gmail\.com$/,"please enter a valid email"],
    },

    password:{
        type:String,
        required:true,
        min:[5,"password should be more than 5 character"],
        max:[20,"password should not be more than 20 character"],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,"password format is invalid"],

    },
    role:{
        type:String,
        required:true,
        enum:["user","admin"],
        default:"user",
    },
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
    },
},
    {
        timestamps:true,
    }
);

export default mongoose.model("User",userSchema);