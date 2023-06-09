const Usermodle = require("../modules/Usermodle");
const ErrorHandler = require("../utils/errorhandler");
const catchasyncerrors = require("./catchasyncerrors");
const jwt = require("jsonwebtoken")
exports.isauthenticated = catchasyncerrors( async (req,res,next)=>{

    const { token }= req.cookies;

    if(!token){
        return next(new ErrorHandler("Please login to use this route",401))
    }

    const decodeded = jwt.verify(token,process.env.JWT_SECRET);

    req.user = await Usermodle.findById(decodeded.id);
    next();
});

exports.isautherised = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler("This resorce is allowed to admin only",403))
        }

        next();
    }
}