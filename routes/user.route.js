import express from 'express';
const router = express.Router();

import {
    registerController,
    loginController,
    logoutController,
    fetchAllUserController,
    fetchAUserBYID,
    fetchAUserWithQuery,
    fetchUserWithoutDetails,
    updateController,
    deleteOneUser,
    deleteUserById,
    
} from "../controllers/user.controller.js";

import isAdmin from '../middlewares/auth.middleware.js';

import upload from '../middlewares/upload.file.js';



// create API url
router.post("/registration",upload,registerController);

// LogIn API url
router.post("/login",loginController);

//logOut API url
router.post("/logout",logoutController);

// read API url
router.get("/fetch-all-user",isAdmin,fetchAllUserController); // isAdmin task pending
router.get("/fetch-a-user/:uid",fetchAUserBYID);// 
router.get("/fetch-user-by-query",fetchAUserWithQuery);
router.get("/fetch-user-without-query",fetchUserWithoutDetails);

//update API url
router.patch("/update/:uid", isAdmin, updateController); /// isadmin task pending

// delete API url

router.delete("/delete-a-user",deleteOneUser);
router.delete("/delete-user",deleteUserById) 


export default router;