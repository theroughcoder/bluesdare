import express from "express";
import path from "path"
import mongoose from "mongoose" 
import dotenv from "dotenv"
import seedRouter from "./router/seedRouter.js"
import productRouter from "./router/productRouter.js"
import userRouter from "./router/userRouter.js"
import orderRouter from "./router/orderRouter.js"
   
 dotenv.config();
         
mongoose.connect(process.env.MONGODB_URL).then(()=> {console.log("Connect to DB")}
).catch(err => console.log(err.message))
   
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
         
app.use("/api/seed", seedRouter);
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
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});  
     