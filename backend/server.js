const app = require("./app");
const dotenv =require('dotenv');
const dbconnection = require("../backend/config/database")

//config env
dotenv.config({path:"backend/config/config.env"});

//connection to db
dbconnection();

const server = app.listen(process.env.PORT,()=>{
    console.log(`Serve running at port ${process.env.PORT}`)
}) 

//unhandled Promise Rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shuting down server due to unhandled promise rejection`)

    server.close(()=>{
        process.exit(1);
    })
})