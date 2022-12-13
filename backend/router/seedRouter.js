const express = require ("express");

const Product = require( "../models/productModel.js");
const User = require( "../models/userModel.js");

  
// created a new router 
const router = new express.Router();

 
// defined the router

router.get("/", async(req, res)=>{
    await Product.deleteMany({});
    const createProducts = await Product.insertMany(data.products);
    await User.deleteMany({});
    const createUser = await User.insertMany(data.users);
    res.send({createProducts, createUser});
}) 

   

// export module
module.exports = router;