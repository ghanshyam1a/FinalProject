import User from "../models/user.models.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import {v4} from 'uuid';
import {sendEmail} from "../utils/mail.utils.js";
import dotenv from 'dotenv';
dotenv.config();

// Registeration controller
const registerController = async(req,res) =>{
    console.log(req.files);
    const {email,password} = req.body;
    try {
        
    // user id and password is required for registration

    if(!email){
        return res.status(400).json({
            success:false,
            message:"User is required",
        });
    }

    if(!password){
        return res.status(400).json({
            success:false,
            message:"Password is required",
        });
    }

    // check if user is already register or not
    const user = await User.findOne({email});
    // if user founded
    if(user){
        return res.status(409).json({
            success:false,
            message:"Account Exists!! Please Login",
        });
    }

    // encrypting the password 
    const saltRounds =10;
    const hashedPassword = await bcrypt.hash(password,saltRounds);

    // initiate a new user and save it to the Database

    const newUser = await new User({
        email,
        password:hashedPassword,

    }).save();

    const subject = "Registration Email";
    const msg = `<h1>Welcome to Busy Store</h1><p>Thank your resitering to your service</p><a style="background-color: lime; padding: 5px 10px; border-radius: 10px" href="https://youtube.com">Login now</a>`;


    // send email to registration user
    sendEmail(subject,msg,newUser.email);

        return res.status(200).json({
            success:true,
            message:"User has registered successfully",
            data:newUser,
        });
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};

// login controller
const loginController = async(req,res) =>{
    
    try {
        const {email , password} = req.body;
        if(!email){
            return res.status(400).json({
                success:false,
                message:"Email is required",
            });
        }
        if(!password){
            return res.status(400).json({
                success:false,
                message:"Password is required",
            });
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found",
            });
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Email or Password id invaild",
            });
        }

        const userDetails = {
            id:user._id,
            email:user.email,
            role:user.role,
        };

        const authToken = await jwt.sign(userDetails,process.env.JWT_SECRET,{
            expiresIn: 24 * 60 * 60 * 1000,
        });

        // set the cookies

        res.cookie("authToken",authToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            path:"/",
        });
        // authorization .......
        // saving the user in the request object for isAdmin middleware access

        req.user = userDetails;

        const subject = "LogIn Email";
        const msg = `<h1>Welcome to Busy Store</h1><p>Thank your Log In on our service</h1>`;

    
    // send email to registration user
    sendEmail(subject,msg,userDetails.email);

        return res.status(200).json({
            success:true,
            message:"User has Loggen In successfully",
            data:userDetails,
        });

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server error",
            err:err.message,
        });
    }
};

// log out controller
const logoutController = async(req,res)=>{
    try {
        res.clearCookie("authToken",{
            httpOnly:process.env.COOKIE_HTTPONLY,
            secure:process.env.NODE_ENV === "production",
            path:"/",
        });

        return res.status(200).json({
            success:true,
            message:"user logged out successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};

// fetchAllUser
const fetchAllUserController = async(req,res)=>{
    try {

        // pagination 
        const page = parseInt(req.query.page); //1
        const limit = parseInt(req.query.limit); //10
        const skip = (page-1) * limit;
        
        const noOfUsers = await User.countDocuments();
        const users = await User.find()
        .limit(limit)
        .skip(skip)
        .sort({createdAt: -1});

        if(users.length === 0){
            return res.status(404).json({
                success:false,
                message:"User not found",
            });
        }

        return res.status(200).json({
            success:true,
            message:"Users founded successfully",
            data:users,
            pagination:{
                noOfUsers,
                limit,
                page,

                totalPages: Math.ceil(noOfUsers/limit),
                hasNextPage:page * limit < noOfUsers,
                hasPrevPage: page > 1,
            }
        });
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};

// fetch a user using by ID
const fetchAUserBYID =async(req,res) =>{
    try {
        const { uid } = req.params;
        const user = await User.findById(uid);

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found",
            });
        }

        return res.status(200).json({
            success:true,
            message:"User has founded by ID",
            data:user,
        });
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};

// fetch a user with query
const fetchAUserWithQuery = async(req,res) =>{
    try {
    const {uid } = req.query;
    const user = await User.findById(uid);

    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found",
        });
    }

    return res.status(200).json({
        success:true,
        message:"user founded",
        data:user,
    });
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};

// fetch a user without details
const fetchUserWithoutDetails = async(req,res)=>{
    try {
        const {email} = req.body;
        const user = await User.findOne({email});  
        
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not founded",
            });
        }

        return res.status(200).json({
            success:true,
            message:"user founded",
            data:user,
        });

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};

// update a user 
const updateController = async(req,res) =>{
    try {
    const { uid } = req.params;
    const {password} = req.body;

    if(!password){
        return res.status(400).json({
            success:false,
            message:"Please enter a password",
        });
    }

    const saltRounds =10;
    const hashedPassword = await bcrypt.hash(password,saltRounds);

    const user = await User.findByIdAndUpdate(uid,{
        password:hashedPassword,
    },
    {
        new:true,
    }
);

    if(!user){
        return res.status(404).json({
            success:false,
            message:"user is not found",
        });

    }

    
    //     const subject = "details updated Email";
    //     const msg = `<h1>Welcome to Busy Store</h1><p>Thank you user details updated</h1>`;

    
    // // send email to registration user
    // sendEmail(subject,msg,user.email);

    return res.status(200).json({
        success:true,
        message:"user password updated",
        data:user,
    });

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};

// delete a user
const deleteOneUser = async(req,res)=>{
    try {
        const {email} = req.body;
        if(!email) {
            return res.status(400).json({
                success:false,
                message:"email is required",
            });
        }
        const user = await User.deleteOne();

        return res.status(200).json({
            success:true,
            message:"user has deleted",
        });
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};

// delete a user using params
const deleteUserById = async(req,res)=>{
    try {
    const {uid} = req.query;
    
    if(!uid){
        return res.status(400).json({
            success:false,
            message:"user id is required",
        });
    }

    await User.findByIdAndDelete(uid);

    return res.status(200).json({
        success:true,
        message:"user deleted",
    });
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
        });
    }
};

export {registerController,loginController,fetchAllUserController,fetchAUserBYID,fetchAUserWithQuery,fetchUserWithoutDetails,
    updateController,deleteOneUser,deleteUserById,logoutController
};