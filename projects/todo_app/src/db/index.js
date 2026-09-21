import mongoose from "mongoose";
import config from "../configs/config.js";

const connectDB = async() => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        console.log("Mongodb connected Successfully!!");
        
    } catch (error) {
        console.log(`Mongodb connection failed!! ${error}`);
        process.exit(1);
    }
}

export default connectDB;