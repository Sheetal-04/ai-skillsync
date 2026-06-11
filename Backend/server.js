import app from "./src/app.js";
import dotenv from "dotenv";
dotenv.config(); //loading environment variables from .env file
import connectDB from "./src/config/database.js";

connectDB();
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})