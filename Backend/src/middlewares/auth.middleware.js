import jsonwebtoken from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js";

export const authUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        const blacklistToken = await tokenBlacklistModel.findOne({ token });
        if (blacklistToken) {
            return res.status(401).json({ message: "Token has been blacklisted" });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}