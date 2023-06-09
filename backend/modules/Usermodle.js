const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[30,"Name is too long"],
        minlienght:[4,"NAme is too short"]
    },
    email:{
        type:String,
        required:[true,"Please enter email id"],
        unique:true,
        validator:[validator.isEmail,"Please enter valid mail"]
    },
    password:{
        type:String,
        required:[true,"Please enter password"],
        minlienght:[4,"Min length of password must b 4"],
        maxlenght:[8,"Max lenght for password is 8"],
        select:false,
    },
    avatar:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }      
        },
    role:{
        type:String,
        default:"user"
    },
    resetpasswordtoken:String,
    resetpasswordExpire:Date,
    
})

userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password,10)
})


userSchema.methods.getjwttoken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    })
}

userSchema.methods.comparepassword = async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password)
}

userSchema.methods.genraterestpasswordtoken = async function(){
    const resettoken = crypto.randomBytes(20).toString("hex");

    this.resetpasswordtoken = crypto.createHash("sha256")
    .update(resettoken)
    .digest("hex");

    this.resetpasswordExpire= Date.now() +15*60*1000;

    return resettoken;
}
module.exports = mongoose.model("User",userSchema)