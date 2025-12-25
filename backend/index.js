import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import  dotenv  from "dotenv";
dotenv.config()
import connectDb from "./config/db.js";
import userRoute from "./routes/user.routes.js"
import companyRoute from "./routes/company.route.js"
import jobRoute from "./routes/job.route.js"
import applicationRoute from "./routes/application.route.js"

const app = express();
const port = process.env.PORT || 3000;
//middle wares
app.use(express.json())
app.use(express.urlencoded({extended:true})) //unaware
app.use(cookieParser())//unaware
const corsOption = {
    orign : 'http//localhost:5173',
    credentials:true
}//unaware
app.use(cors(corsOption))



app.get('/',(req,res)=>{
    try{
       res.send("healthy")
    }
    catch(err){
        res.status(400).json({msg:err})
        console.log("err from healthy")
    }
})


//api's
app.use("/api/v1/user",userRoute)
app.use("/api/v1/company",companyRoute)
app.use("/api/v1/job",jobRoute)
app.use("/api/v1/application",applicationRoute)


app.listen(port , async()=>{
    try{
        await connectDb()
        console.log("server running at port",port)
    }
    catch(err){
         console.log("server error",err)
    }
})