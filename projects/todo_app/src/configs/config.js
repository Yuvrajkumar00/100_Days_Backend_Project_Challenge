import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
});

if(!process.env.PORT) {
    throw new Error("PORT is not defined in environment variables");
}

if(!process.env.BASE_URL) {
    throw new Error("BASE_URL is not defined in environment variables");
}
if(!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

const confi = {
    PORT: process.env.PORT,
    BASE_URL: process.env.BASE_URL,
    MONGODB_URI: process.env.MONGODB_URI,
}

export default confi;