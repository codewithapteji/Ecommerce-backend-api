const ErrorHandle = require('../utils/errorhandler');

module.exports = (err,req,res,next)=>{
    err.statuscode = err.statuscode || 500;
    err.message = err.message || "Internal server error";


    if(err.code === 11000){
        const message = `Duplticate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandle(message,400)
    }
    res.status(err.statuscode).json({
        success:false,
        message:err.message
    })
}