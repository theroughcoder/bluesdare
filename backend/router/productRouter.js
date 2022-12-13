const express = require ("express");
const expressAsyncHandler = require( "express-async-handler");
const Product = require( "../models/productModel.js");
const { isAdmin } = require("../utils.js");
const { isAuth } = require( "../utils.js");

const router = new express.Router();

router.get('/', async(req, res)=>{
    const products = await Product.find().sort({createdAt: -1})
    ;
    res.send(products);
})  

router.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      image: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    });
    const product = await newProduct.save();
    res.send({ message: 'Product Created', product });
  })
);
  
const PAGE_SIZE = 3;
router.get("/admin", isAuth, isAdmin, expressAsyncHandler(async (req, res) => { 
  const {query} = req;
  const page = query.page;
  const pageSize = 6 ;

    const products = await Product.find()
      .sort({createdAt: -1})
      .skip(pageSize * (page - 1))
      .limit(pageSize);

 
      
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);


router.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };
        const countProducts = await Product.countDocuments({
          ...queryFilter,
          ...categoryFilter,
          ...priceFilter,
          ...ratingFilter,
        });
        
    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  }) 
);

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
  router.put("/:id", isAuth, isAdmin, expressAsyncHandler(async (req, res) => {

    const product = await Product.findOne({_id: req.params.id}); 
    
    if (product) {
      product.name = req.body.name;
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.image = req.body.image;
      product.images = req.body.images;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      product.rating = req.body.rating;
      
      await product.save();
       res.send({message: "Product updated"});
    } else { 
      res.status(404).send({ message: "Product not found" });
    }
  }));

  router.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res)=>{
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: 'Product Deleted' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  }))

    

module.exports = router; 