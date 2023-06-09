const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name"]
    },
    discription:{
        type:String,
        required:[true,"Please enter product discription"]
    },
    price:{
        type:Number,
        required:[true,"Please enter product price"],
        maxLength:[8,"price cannot exied 8 characters"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }      
    }],
    category:{
        type:String,
        required:[true,"please enter category of product"]
    },
    stock:{
        type:Number,
        required:[true,"Please enter stock of product"],
        default:0
    },
    numOfReview:{
        type:Number,
        default:0
    },
    reviews:[{
        name:{
            type:String,
            required:true,
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String
        }
    }],

    createdby:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAT:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Product",productSchema);