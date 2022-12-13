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

// const httpServer = http.Server(app);
const server = createServer(app); 
const io = new Server(server, {cors: {origin: '*'}});

const users = [];

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    const user = users.find((x) => x.socketId === socket.id);
    if(user){
      user.online = false;
      console.log('Offline', user.name);
      const admin = users.find((x)=> x.isAdmin && x.online);
      if(admin){
        io.to(admin.socketId).emit('updateUser', user);
      }
    }
  });

  socket.on('onLogin', (user)=>{
    const updatedUser ={
      ...user,
      online: true,
      socketId : socket.id,
      message: []
    };
    const existUser = users.find((x) => x._id === updatedUser._id);
    if(existUser) {
      existUser.socketId = socket.id;
      existUser.online = true;
    }else{
      users.push(updatedUser);
    }
    console.log('Online', user.name);
    const admin = users.find((x)=> x.isAdmin && x.online);
    if(admin){
      io.to(admin.socketId).emit('updateUser', updatedUser)
    }
    if(updatedUser.admin){
      io.to(updatedUser.socketId).emit('listUsers', users)
    }
  }); 
  socket.on('onUserSelected', (user) => {
 
    const admin = users.find((x)=> x.isAdmin &&  x.online)
    if(admin) {
      const existUser = users.find((x) => x._id === user._id);
      io.to(admin.socketId).emit('selectUser', existUser);
            
 
    }
  })
  socket.on('onMessage', (message) => {
    if(message.isAdmin) {
      const user = users.find((x) => x._id === message._id && x.online)
      if(user){
        io.to(user.socketId).emit('message', message);
        user.message.push(message);
      }
    }else{ 
      const admin = users.find((x)=> x.isAdmin && x.online);
      if(admin) {
        io.to(admin.socketId).emit('message', message);
        const user = users.find((x)=> x._id === message._id && x.online);
        user.message.push(message);
      }else{
        io.to(socket.id).emit('message', {
          name: 'Admin',
          body: 'Sorry. I am not online right now'
        })
      }
    }
  })
});

server.listen(port, ()=>{
  console.log(`Server at http://localhost:${port}`);
})
 
// app.listen(port, () => {
//   console.log(`Server is running at port ${port}`);
// });  
       