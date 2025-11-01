import express from "express";
const router = express.Router();

import { 
    createProductController,
    fetchAllProduct,
    fetchAProductUsingQuery,
    fetchProductUsingParams,
    fetchAProduct,
    updateProductControllerByUid,
    deleteProductControllerById
}from "../controllers/product.controller.js";

import isAdmin from "../middlewares/auth.middleware.js";
// create url API
router.post("/create-product",createProductController);

// fetch all product url API
router.get("/fetch-all-product",isAdmin,fetchAllProduct);

// fetch a product using query 
router.get("/fetch-a-product-using-query",fetchAProductUsingQuery);

// fetch a product using query 
router.get("/fetch-a-product-using-params/:uid",fetchProductUsingParams);

// fetch a product 
router.get("/fetchAProduct",fetchAProduct);
// update url API
router.patch("/update-product/:uid",isAdmin,updateProductControllerByUid);

// delete url API
router.delete("/delete-product",deleteProductControllerById);
export default router;