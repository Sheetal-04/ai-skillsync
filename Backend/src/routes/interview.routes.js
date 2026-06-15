import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/file.middleware.js"
import * as interviewController from "../controllers/interview.controller.js"
const interviewRouter = Router();


/**
 * @route POST api/interview/
 * @description Generate new interview report on the basis of resume pdf, job description and self description
 * @access private
 */
interviewRouter.post("/", authUser, upload.single("resume"), interviewController.generateInterviewReportController);

/**
 * @route GET api/interview/report/:interviewId
 * @description Get interview report by interview id
 * @access private
 */
interviewRouter.get("/report/:interviewId", authUser, interviewController.getInterviewReportByIdController);
 
/**
 * @route GET api/interview/
 * @description Get all interview reports of logged in user
 * @access private
 */
interviewRouter.get("/", authUser, interviewController.getAllInterviewReportsController);


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authUser, interviewController.generateResumePdfController)

export default interviewRouter;