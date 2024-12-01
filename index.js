const express = require('express');

const mongoose = require("mongoose");

const authRouter = require('./routes/auth');
const bannerRouter = require('./routes/banner');
const categoryRouter = require('./routes/category');
const subcategoryRouter = require('./routes/sub_category');
const productRouter = require('./routes/product');
const productReviewRouter = require('./routes/product_review')
const vendorRouter = require('./routes/vendor');
const orderRouter = require('./routes/order');
const cors = require('cors');
const PORT = 8088;

const app = express();

const DB = "mongodb+srv://22521618:Atng1234567890@cluster0.ijzml.mongodb.net/";

app.use(express.json());
app.use(cors());
app.use(authRouter);
app.use(bannerRouter);
app.use(categoryRouter);
app.use(subcategoryRouter);
app.use(productRouter);
app.use(productReviewRouter);
app.use(vendorRouter);
app.use(orderRouter);


mongoose.connect(DB).then(() => {
    console.log('mongoose Db connecteed');
})

app.listen(PORT,"0.0.0.0", function(){
    console.log(`server is running on port ${PORT} `);
})