const ErrorHandler = require("../utils/errorhandler");
const catchasyncerrors = require('../middleware/catchasyncerrors');
const User = require('../modules/Usermodle');
const sendtoken = require("../utils/jwttoken");
const sendEmail = require("../utils/sendemail");

//register a new user
exports.registeruser = catchasyncerrors( async (req,res,next)=>{

    const {name,email,password}= req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"sample id",
            url:"sample url"
        }
    });

    sendtoken(user,201,res);
})


exports.loginuser = catchasyncerrors( async(req,res,next)=>{

    const {email,password} = req.body

    if(!email || !password){
        return next(new ErrorHandler("Please enter Email or password",400))
    }

    const user = await User.findOne({ email }).select("+password");

    if(!user){
        return next(new ErrorHandler("Please enter valid Email or password",401))
    }

    const ispasswordmacthed = await user.comparepassword(password);

    if(!ispasswordmacthed){
        return next(new ErrorHandler("Please enter valid Email or password",401))
    }

    sendtoken(user,200,res);
})

exports.logoutuser= catchasyncerrors(async (req,res,next)=>{

    res.cookie("token",null,{
    expires: new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        sucess:true,
        msg:"User logged out"
    })
});

exports.forgotpassword= catchasyncerrors(async (req,res,next)=>{

    const user = await User.findOne({email:req.body.email})

    if(!user){
        return next(new ErrorHandler("User not found with thi mail id",404))    
    }

    //get reset password token
    const resettoken = user.genraterestpasswordtoken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resettoken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} 
  \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetpasswordtoken = undefined;
    user.resetpasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
})


exports.getuserdetails = catchasyncerrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

exports.updatepassword = catchasyncerrors( async(req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password")
    const ispasswordmacthed = await user.comparepassword(req.body.oldpassword);

    if(!ispasswordmacthed){
        return next(new ErrorHandler("password did not matched with old password",400))
    }

    if(req.body.newpassword !== req.body.confirmpassword){
        return next(new ErrorHandler("old and new password did not matched",400))
    }

    user.password = req.body.newpassword;
    await user.save();

    sendtoken(user,200,res)
})


exports.updateuserdetails = catchasyncerrors( async(req,res,next)=>{

    const newdetails = {
        name:req.body.name,
        email:req.body.email
    }

    const updateduser = await User.findByIdAndUpdate(req.user.id,newdetails);

    res.status(200).json({
        success:true,
        message:"user updated"
    })
})

////----admin---////
exports.getallusers = catchasyncerrors( async (req,res,next)=>{

    const users = await User.find();

    res.status(200).json({
        sucess:true,
        users
    })
})


////----admin---////
exports.getsingleuser = catchasyncerrors(async (req,res,next)=>{

    const user = User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler("User not found with this id",401))
    }

    res.status(200).json({
        sucess:true,
        user
    })
})

////--admin---////
exports.updateuserrole = catchasyncerrors( async(req,res,next)=>{

    const newdetails = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const updateduser = await User.findByIdAndUpdate(req.user.id,newdetails);

    res.status(200).json({
        success:true,
        message:"user updated"
    })
})


////--admin---////
exports.deleteuser = catchasyncerrors( async(req,res,next)=>{

    const user = await User.findByIdAndDelete(req.params.id);

    if(!user){
        return next(new ErrorHandler("User not found with this id",400))
    }

    res.status(200).json({
        success:true,
        message:"user deleted"
    })
})