const express = require("express");
const { registeruser, 
        loginuser, 
        logoutuser, 
        forgotpassword, 
        getuserdetails, 
        updatepassword, 
        updateuserdetails,
        getallusers,
         getsingleuser, 
         updateuserrole,
         deleteuser} = require("../controller/usercontroller");
const { isauthenticated,isautherised } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registeruser);

router.route("/login").post(loginuser);

router.route("/logout").get(logoutuser);

router.route("/forgot").post(forgotpassword)

router.route("/me").get(isauthenticated,getuserdetails);

router.route("/updatepassword").put(isauthenticated,updatepassword);

router.route("/updateuserdetails").put(isauthenticated,updateuserdetails);

router.route("/admin/users").get(isauthenticated,isautherised("admin"),getallusers);

router.route("/admin/user/:id").get(isauthenticated,isautherised("admin"),getsingleuser);

router.route("/admin/updateuserorle").put(isauthenticated,isautherised("admin"),updateuserrole);

router.route("/admin/deleteuser/:id").delete(isauthenticated,isautherised("admin"),deleteuser);



module.exports = router;