const express = require('express');
const fs = require('fs/promises');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
const serverConfig = require('./config/serverConfig');
const { connectDB } = require('./config/dbConfig');
const { email } = require('zod');
const User = require('./schema/userSchema');
const userRouter = require('./routes/userRoute');
const cartRouter = require('./routes/cartRoute');
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const uploader = require('./Middlewares/multerMidlleware');
const cloudinary = require('./config/cloudinaryConfig');
const { isLoggedIn } = require('./validation/authValidator');

app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use('/users',userRouter);
app.use('/carts',cartRouter);
app.use('/auth',authRouter);
app.use('/products',productRouter);

app.get('/ping',isLoggedIn,(req,res)=>{
    console.log(req.body);
    console.log(req.cookies);
    return res.json({
        message : "testing"
    })
});

app.post('/photo',uploader.single('incomingFile'),async (req,res)=>{
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log("Result from cloudinary : ",result);
    await fs.unlink(req.file.path);
    return res.json({message : "Image Uploaded"});
});

app.listen(serverConfig.PORT,async ()=>{
    await connectDB();
    console.log(`Server started at port ${serverConfig.PORT} ...`);

    // const newUser = await User.create({
    //     email : 'abhs@gmail.com',
    //     password : '123dsna',
    //     firstName : 'Johnathnn',
    //     lastName : 'Doedt',
    //     mobileNumber : '6395429599',
    // });
    // console.log("Created new user");
    // console.log(newUser);
});