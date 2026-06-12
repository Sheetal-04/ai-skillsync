import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js";
dotenv.config(); //loading environment variables from .env file

connectDB();
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})