const { createServer } = require( 'http');
const { Server } = require( 'socket.io');
const express = require( "express");
const path = require( "path")
const mongoose = require( "mongoose") 
const dotenv = require( "dotenv")
const seedRouter = require( "./router/seedRouter.js")
const productRouter = require( "./router/productRouter.js")
const userRouter = require( "./router/userRouter.js")
const orderRouter = require( "./router/orderRouter.js")
const uploadRouter = require( "./router/uploadRouter.js") 
const { isAdmin } = require( './utils.js');
const cors = require( 'cors')


let allowed = [  'http://localhost:3000','http://postman.com', 'some other link'];
function options(req, res){
    let temp;
    let origin = req.header('origin');
    if(allowed.indexOf(origin) > -1){
        temp ={
            origin: true,
            optionSuccessStatus: 200
        } 
    }else{
         temp={
            origin :"stupid"
         }   
    }
    res(null, temp)
}

 dotenv.config();
           
mongoose.connect(process.env.MONGODB_URL).then(()=> {console.log("Connect to DB")}
).catch(err => console.log(err.message))
   
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
             
app.use("/api/seed", seedRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
   
const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, '/frontend/build')));
app.get("*", (req, res) => 
res.sendFile(path.join(_dirname, 'frontend/build/index.html')));

app.use((err, req, res, next) =>{
  res.status(500).send({ message: err.message});
}) 
   
const port = process.env.PORT || 5000;


app.listen(port, ()=>{
  console.log(`server is running at port :${port}`);
})
  
       