import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/file.middleware.js"
import * as interviwController from "../controllers/interview.controller.js"
const interviewRouter = Router();


/**
 * @route POST api/interview/
 * @description Generate new interview report on the basis of resume pdf, job description and self description
 * @access private
 */
interviewRouter.post("/", authUser, upload.single("resume"), interviwController.generateInterviewReportController);

/**
 * @route GET api/interview/report/:interviewId
 * @description Get interview report by interview id
 * @access private
 */
interviewRouter.get("/report/:interviewId", authUser, interviwController.getInterviewReportByIdController);
 
/**
 * @route GET api/interview/
 * @description Get all interview reports of logged in user
 * @access private
 */
interviewRouter.get("/", authUser, interviwController.getAllInterviewReportsController);
export default interviewRouter;