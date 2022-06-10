import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

const router = new express.Router();

router.get('/', async(req, res)=>{
    const products = await Product.find();
    res.send(products);
})  

router.get("/slug/:slug", async(req, res) => {
    const product = await Product.findOne({slug : req.params.slug});
       
    if (product) {
      res.send(product);   
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  });  
  router.get('/categories', expressAsyncHandler(async (req, res) => {
      const categories = await Product.find().distinct('category');
      res.send(categories);
    })
  ); 
  router.get("/:id", async(req, res) => {
    const product = await Product.findById(req.params.id); 
    
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  });

    

export default router; 