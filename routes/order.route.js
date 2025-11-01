import express from 'express';
const router = express.Router();
import {createOrderController,
        fetchAllOrdersController,
        fetchAOrderUsingQuery,
        fetchOrderUsingParams,
        fetchOrder,
        updateController
    } from "../controllers/order.controller.js";
import isAdmin from "../middlewares/auth.middleware.js";
router.post("/create-order",createOrderController);
router.get("/fetch-all-order",isAdmin,fetchAllOrdersController);
router.get("/fetch-order",fetchAOrderUsingQuery); // getting error
router.get("/fetch-order-by-params/:uid",fetchOrderUsingParams); // getting error
router.get("/fetch-order",fetchOrder); // getting error
router.patch("/update-order/:uid",updateController);
export default router;