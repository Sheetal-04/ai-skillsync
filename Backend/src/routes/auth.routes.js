import { Router } from "express";
const authRouter = Router();
import * as authController from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

/**
 * @route POST api/auth/register
 * @description Register new user
 * @access public
 */
authRouter.post("/register", authController.resgisterUserController);

/**
 * @route POST api/auth/login
 * @description Login user
 * @access public
 */
authRouter.post("/login", authController.loginUserController);

/**
 * @route GET api/auth/logout
 * @description Logout user
 * @access public
 */
authRouter.get("/logout", authController.logoutUserController);

/**
 * @route GET api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authRouter.get("/get-me", authUser, authController.getMeController);
export default authRouter;