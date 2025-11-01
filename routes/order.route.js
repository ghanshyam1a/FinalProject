import express from 'express';
const router = express.Router();
import {createOrderController,
        fetchAllOrdersController,
        fetchAOrderUsingQuery,
        fetchOrderUsingParams,
        fetchOrder,
        updateController,
        deleteOrderByQueryController
    } from "../controllers/order.controller.js";
import isAdmin from "../middlewares/auth.middleware.js";
router.post("/create-order",createOrderController);
router.get("/fetch-all-order",isAdmin,fetchAllOrdersController);
router.get("/fetch-order-query",fetchAOrderUsingQuery); 
router.get("/fetch-order-by-params/:oid",fetchOrderUsingParams); 
router.get("/fetch-order",fetchOrder); 
router.patch("/update-order/:uid",updateController);

router.delete("/delete-a-order",deleteOrderByQueryController);

export default router;