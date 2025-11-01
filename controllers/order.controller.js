import Order from "../models/order.model.js";
import {sendEmail} from "../utils/mail.utils.js";

// create order controller
const createOrderController = async(req,res)=>{
    try {
        const {product,user} = req.body;
        if(!product){
            return res.status(400).json({
                success:false,
                message:"Product is required",
            });
        }
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User id is required",
            });
        }
        const newOrder = await new Order({product,user}).save();
        const myOrder = await Order.findById(newOrder._id).populate("product").populate("user");

        const subject = "Order Recieved";
        const msg = "<h1>hank you for placing order with us</h1>";

        // send order recieved email to user
        sendEmail(subject,msg,myOrder.email);

        return res.status(201).json({
            success:true,
            message:"order created successfully",
            data:myOrder,
        });
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            data:err.data,
        });
    }
};

// fetch all order controller

const fetchAllOrdersController = async (req,res) =>{
    try {
        const noOfOrder = await Order.countDocuments();
        const orders = await Order.find();

        return res.status(200).json({
            success:true,
            message:"Order found successfully",
            noOfOrder,
            data:orders,
        });

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};

// fetch a user using query

const fetchAOrderUsingQuery = async(req,res) =>{
    try {
    const {uid} = req.query;
    if(!uid){
        return res.status(404).json({
            success:false,
            message:"uid did not found",
        });
    }      
    const order = await Order.findById(uid);
    if(!order){
        return res.status(404).json({
            success:false,
            message:"order did not found",
        });
    }

    return res.status(200).json({
        success:true,
        message:"order has founded",
        data:order,
    });

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};        // getting error

//fetch a order using params

const fetchOrderUsingParams = async(req,res) =>{
    try {
        const { uid } = req.params;
        const order = await Order.findById(uid);
        if(!order){
            return res.status(404).json({
                success:false,
                message:"Order did not found",
            });
        }
        return res.status(200).json({
            success:true,
            message:"order has founded",
            data:order,
        });

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};                // getting order

// fetch a order without params and query

const fetchOrder = async(req,res) =>{
    try {
        const {product, user} = req.body;
        if(!product && !user){
            return res.status(404).json({
                success:false,
                message:"product or user id required",
            });
        }
        const order = await Order.findOne({product,user});
        if(!order){
            return res.status(404).json({
                success:false,
                message:"order not found",
            });
        }

        return res.status(200).json({
            success:true,
            message:"order has founded",
            data:order,
        });

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};

// update order controller

const updateController  = async(req,res) =>{
    try {
        const {uid} = req.params;
        const {product,user} = req.body;

        if(!uid){
            return res.status(400).json({
                success:false,
                message:"User id is required",
            });
        }

        if(!product && !user){
            return res.status(400).json({
                success:false,
                message:"Product id or User id is required",
            });
        }

        const order = await Order.findByIdAndUpdate(uid,
            {product,user},
            {
            new:true,});

        if(!order){
            return res.status(404).json({
                success:false,
                message:"Order not found",
            });
        }

        return res.status(200).json({
            success:true,
            message:"Order details updated",
            data:order,
        });
        
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};
export {createOrderController,fetchAllOrdersController,fetchAOrderUsingQuery,fetchOrderUsingParams,fetchOrder,updateController};