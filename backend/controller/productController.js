const Product = require("../modules/Productmodules");
const ErrorHandler = require("../utils/errorhandler");
const catchasyncerrors = require('../middleware/catchasyncerrors')
const Apifeatures = require('../utils/apifeatures');

//create product--Admin
exports.createProduct = catchasyncerrors(async (req,res) =>{
    
    req.body.createdby= req.user.id;
    
    const product = await Product.create(req.body);

    res.status(200).json({
        success:true,
        product
    })
})

//get all product --Admin
exports.getAllproduct =  catchasyncerrors(async (req,res,next)=>{

    const resultperpage = 5;
    const productcount = await Product.countDocuments();
    const apifeatures = new Apifeatures(Product.find(),req.query)
    .search()
    .filter()
    .pegination(resultperpage);

    const allproducts = await apifeatures.query;

    // const allproducts = await Product.find();
    res.status(200).json({
        msg:"all Products",
        allproducts,
        productcount
    })
})

//update product --ADmin
exports.updateproduct =  catchasyncerrors(async (req,res,next)=>{
    let product = Product.findById(req.params.id);

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true})

    if(product === null){
        return  next(new ErrorHandler("product not found",404))
    }

    res.status(200).json({
        success:true,
        msg:"Product updated",
        product
    })
})

//get porduct details
exports.productdetails=  catchasyncerrors(async (req,res,next)=>{
    const product =await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("product not found",404))
    }

    res.status(200).json({
        success:true,
        msg:"product found",
        product
    })
})

//delete product --Admin
exports.deleteProduct =  catchasyncerrors( async (req,res,next)=>{

    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Wrong Id",500))
    }

    product = Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success:true,
        msg:"Product deleted",
        product
    })
})