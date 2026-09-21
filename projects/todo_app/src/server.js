import connectDB from "./db/index.js";
import app from "./app.js";
import config from "./configs/config.js";

const PORT = config.PORT || 8000;

// connect database
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`app is running on the port: ${PORT}`);
        })
    })