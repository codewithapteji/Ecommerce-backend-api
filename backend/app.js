const express = require('express');
const app = express();
const Errorhandler = require('./middleware/error');
const cookieparser = require('cookie-parser');

app.use(express.json())
app.use(cookieparser());

const product = require("./routers/productRouter");
const user = require("./routers/userRouter")
app.use("/api",product);
app.use("/api",user)

//middleware for error
app.use(Errorhandler)
module.exports = app; 