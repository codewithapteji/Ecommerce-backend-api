const mongoose = require('mongoose');



const dbconnection = ()=>{
    mongoose.connect(process.env.DB_URI)
    .then((data)=>{
        console.log("mongoDB connect")
    })
}

module.exports = dbconnection;