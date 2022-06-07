import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import { isAuth } from "../utils.js";

const router = new express.Router();
 
router.post('/', isAuth, expressAsyncHandler(async(req, res)=>{
   
   const newOrder = new Order({
     orderItems: req.body.orderItems.map((x)=>({...x, product: x._id})),
     shippingAddress: req.body.shippingAddress,
     paymentMethod: req.body.paymentMethod,
     itemsPrice: req.body.itemsPrice,
     shippingPrice: req.body.shippingPrice,
     tax: req.body.tax,
     totalPrice: req.body.totalPrice,
     user: req.user._id
  
   })
  
   const order = await newOrder.save();
   res.status(201).send({message: 'New Order Created', order});
  }))  
   
  router.get('/history',isAuth, expressAsyncHandler(async(req, res)=>{
    
    const orders = await Order.find({user : req.user._id})
   
    if (orders) {
     res.send(orders)
    } else {
      res.status(404).send({ message: "order not found" });
    }
  }))
  
  router.get('/:id',isAuth, expressAsyncHandler(async(req, res)=>{
    const order = await Order.findById(req.params.id)
   
    if (order) {
      if(order.user == req.user._id){
        res.send(order);
      } else{
        res.status(404).send({ message: "This is not your order ID" }); 
      }
    } else {
      res.status(404).send({ message: "order not found" });
    }
  }))

 
export default router;