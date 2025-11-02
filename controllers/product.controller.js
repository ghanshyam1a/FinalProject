import Product from "../models/product.model.js";




// Create Product Controller
const createProductController = async(req,res) => {
    try {
        const { name, price } = req.body;
        if(!name){
            return res.status(400).json({
                success:false,
                message:"product name is required",
            });
        }
        if(!price){
            return res.status(400).json({
                success:false,
                message:"Product price is required",
            });
        }

        

        const product = await Product.findOne({name});
        if(product){
            return res.status(400).json({
                success:false,
                message:"product creation is failed! Product already exists",
            });
        }

        const newProduct = await new Product({name,price}).save();

        return res.status(201).json({
            success:true,
            message:"Product created successfully",
            data:newProduct,
        });


    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};

// fetch all product

const fetchAllProduct = async(req,res) =>{
    try {

        //  check admin via token manually
        
        // const authToken = req.cookies?.authToken;
        // if(!authToken){
        //     return res.status(401).json({
        //         success:false,
        //         message:"Unauthorized request Token missing",
        //     });
        // }

        // const userDetails = Jwt.verify(authToken,process.env.JWT_SECRET);
        // if(userDetails.role !== "admin"){
        //     return res.status(403).json({
        //         success:false,
        //         message:"you are not authorized to access this information",
        //     });
        // }
        // page pagenation
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        const noOfProducts= await Product.countDocuments();
        const products = await Product.find()
        .limit(limit)
        .skip(skip)
        .sort({createdAt : -1});
        if(products.length === 0){
            return res.status(400).json({
                success:false,
                message:"No Product found",
            });
        }

        return res.status(200).json({
            success:true,
            message:"Product founded successfully",
            data:products,
            pagination:{
                noOfProducts,
                limit,
                page,

                totalPages:Math.ceil(noOfProducts/limit),
                hasNextPage:page * limit < noOfProducts,
                hasPrevPage:page >1,
            },
        });

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
        });
    }
};

// fetch product by query

const fetchAProductUsingQuery = async(req,res) =>{
    try {
        const {uid} = req.query;

        const product = await Product.findById(uid);

        if(!product){
            return res.status(400).json({
                success:false,
                message:"uid is not found",
            });
        }

        return res.status(200).json({
            success:true,
            message:"product founded successfully",
            data:product,
        });
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};

// fetch a product using params

const fetchProductUsingParams = async(req,res) =>{
    try {
    const {uid} = req.params;

    const product = await Product.findById(uid);

    if(!product){
        return res.status(400).json({
            success:false,
            message:"Uid is not found",
        });
    }      

    return res.status(200).json({
        success:true,
        message:"product founded successfully",
        data:product,
    });

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
}; 

// fetch a one user without query or params

const fetchAProduct = async(req,res) =>{
    try {
        const { name } = req.body;

        const product = await Product.findOne({name});

        if(!product){
            return res.status(400).json({
                success:false,
                message:"product not found",
            });
        }

        return res.status(200).json({
            success:true,
            message:"product found successfully",
            data:product,
        });

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};
// update product details

const updateProductControllerByUid = async(req,res) =>{
    try {
    const {uid} = req.params;
    const {name,price} = req.body;

    if(!uid){
        return res.status(400).json({
            success:false,
            message:"please provide uid",
        });
    }

    // Enter validate input

    if(!price && !name){
        return res.status(400).json({
            success:false,
            message:"please enter price or name for updating",
        });
    }
    // update product and save
    const product = await Product.findByIdAndUpdate(uid,{name,price},
        {
        new:true,
        }
);
    if(!product){
        return res.status(404).json({
            success:false,
            message:"enter product",
        });
    }

    return res.status(200).json({
        success:true,
        message:"product updated successfully",
        data:product,
    });

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};

// delete product controller

const deleteProductControllerById = async(req,res) =>{
    try {
    const {uid} = req.query;

    // validate uid
    if(!uid){
        return res.status(400).json({
            success:false,
            message:"UID shoulb be mentioned for delete product",
        });
    }      

    await Product.findByIdAndDelete(uid);

    return res.status(200).json({
        success:true,
        message:"product has deleted",
    });
    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"Server Error",
            err:err.message,
        });
    }
};

export {createProductController,fetchAllProduct,fetchAProductUsingQuery,fetchProductUsingParams,fetchAProduct,updateProductControllerByUid,deleteProductControllerById};