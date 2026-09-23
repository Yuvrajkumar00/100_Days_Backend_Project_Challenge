import express from "express";
import cors from "cors";
import config from "./configs/config.js";
import dns from "dns";

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

const app = express();

app.use(cors({
    origin: config.BASE_URL,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'METHOD'],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// import routes
import { userRoute } from "./routes/user.routes.js";

app.use("/api/v1/users", userRoute);

export default app;