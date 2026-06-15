import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();  //creating express app
app.use(express.json()); //middleware to parse request body
app.use(cookieParser()); //middleware to parse cookies
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
//----Routes import ----//
import authRouter from "./routes/auth.routes.js";
import interviewRouter from "./routes/interview.routes.js";

//Setting up routes
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

//----Global error handler (always responds with JSON, never HTML)----//
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
        message: err.message || "Internal Server Error",
    });
});

export default app;