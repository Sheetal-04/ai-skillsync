import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import tokenBlacklistModel from "../models/blacklist.model.js";

/**
 * @name registerUserController
 * @description Register new user, expects username, email, password in request body
 * @route POST api/auth/register
 * @access public
 */
export const resgisterUserController = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please provide all the fields" });
    }
    const isUserAlreadyExist = await userModel.findOne({ $or: [{ username }, { email }] });
    if (isUserAlreadyExist) {
        return res.status(400).json({
            message: isUserAlreadyExist.username === username ? "Username already exists" : "Email already exists"
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({ username, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true });
    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
}
/**
 * @name loginUserController
 * @description Login user, expects email and password in request body
 * @route POST api/auth/login
 * @access public
 */
export const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide all the fields" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect password" });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
}
/**
 * @name logoutUserController
 * @description clear token from user cookies and add token to blacklist
 * @route GET api/auth/logout
 * @access public
 */
export const logoutUserController = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ message: "No token provided" });
    }
    //blacklist token
    await tokenBlacklistModel.create({ token });
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
}
/**
 * @name getMeController
 * @description get the current logged in user details
 * @route GET api/auth/get-me
 * @access private
 */
export const getMeController = async (req, res) => {
   const user  = await userModel.findById(req.user.id);
   return res.status(200).json({
       message: "User details fetched successfully",
       user: {
           id: user._id,
           username: user.username,
           email: user.email,
       }
   });
}
