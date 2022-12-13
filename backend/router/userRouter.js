const express = require ("express");
const bcrypt = require( "bcryptjs");

const User = require( '../models/userModel.js')
const expressAsyncHandler = require( 'express-async-handler');
const { generateToken, isAdmin, isAuth } = require( '../utils.js');
 
 
const router = express.Router();

router.get(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const users = await User.find({});
      res.send(users);
    })
  );

router.post('/signin', expressAsyncHandler(async(req, res)=>{
    const user = await User.findOne({email: req.body.email});
    if(user) {
        if(bcrypt.compareSync(req.body.password, user.password)) {
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token : generateToken(user)
            });
            return;
        }
    }
    res.status(401).send({message: 'Invalid email or password'});
}))
router.post('/signup', expressAsyncHandler(async(req, res)=>{
   
    if(req.body.password == req.body.confirmPassword) {
        const userInfo = {   
            name: req.body.name,
            email: req.body.email,
            isAdmin: false,
            password: bcrypt.hashSync(req.body.password)
        }
         const [user] = await User.insertMany(userInfo)

            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token : generateToken(user)
            });
            return;
    } 
    res.status(401).send({message: 'Password and confirm password didn'+'t match'});
})) 
router.put('/profileupdate', isAuth, expressAsyncHandler(async(req, res)=>{
   
    if(req.body.password == req.body.confirmPassword) {
        const userInfo = {   
            name: req.body.name,
            email: req.body.email,
            isAdmin: false,
            password: bcrypt.hashSync(req.body.password)
        }   
          await User.updateOne({_id : req.user._id}, userInfo)
         const user = await User.findOne({_id : req.user._id})
 
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token : generateToken(user)
            });
            return;
    }
    res.status(401).send({message: 'Password and confirm password didn'+"'"+'t match'});
}))
router.get(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const users = await User.findById(req.params.id);
      res.send(users);
    })
  );
router.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {


    const user = await User.findOne({_id: req.params.id}); 
    
    if (user) {
    user.name = req.body.name,
    user.email = req.body.email,
    user.isAdmin = req.body.isAdmin,

      
      await user.save();
       res.send({message: "User updated"});
    } else { 
      res.status(404).send({ message: "User not found" });
    }})
  );
router.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {


    const user = await User.findOne({_id: req.params.id}); 
    
    if (user) {

      await user.remove();
       res.send({message: "User updated"});
    } else { 
      res.status(404).send({ message: "User not found" });
    }})
  );

module.exports = router;