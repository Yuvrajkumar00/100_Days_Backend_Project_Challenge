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

if(!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables")
}

if(!process.env.ACCESS_TOKEN_EXPIRY) {
    throw new Error("ACCESS_TOKEN_EXPIRY is not defined in environment variables")
}

if(!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables")
}

if(!process.env.REFRESH_TOKEN_EXPIRY) {
    throw new Error("REFRESH_TOKEN_EXPIRY is not defined in environment variables")
}

if(!process.env.MAILTRAP_HOST) {
    throw new Error("MAILTRAP_HOST is not defined in environment variables")
}
if(!process.env.MAILTRAP_PORT) {
    throw new Error("MAILTRAP_PORT is not defined in environment variables")
}
if(!process.env.MAILTRAP_USERNAME) {
    throw new Error("MAILTRAP_USERNAME is not defined in environment variables")
}
if(!process.env.MAILTRAP_PASSWORD) {
    throw new Error("MAILTRAP_PASSWORD is not defined in environment variables")
}

const config = {
    PORT: process.env.PORT,
    BASE_URL: process.env.BASE_URL,
    MONGODB_URI: process.env.MONGODB_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
    MAILTRAP_HOST: process.env.MAILTRAP_HOST,
    MAILTRAP_PORT: process.env.MAILTRAP_PORT,
    MAILTRAP_USERNAME:process.env.MAILTRAP_USERNAME,
    MAILTRAP_PASSWORD: process.env.MAILTRAP_PASSWORD
}

export default config;