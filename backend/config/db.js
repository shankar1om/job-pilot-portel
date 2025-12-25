import mongoose from "mongoose";

const connectDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log(" connection to the db successful ")
    }
    catch(err){
        console.log("error while connecting the db",err)
    }
}
export default connectDb