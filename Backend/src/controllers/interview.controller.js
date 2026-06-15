import { request } from "express";
import { generateInterviewReport, generateResumePdf } from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";
import { PDFParse } from 'pdf-parse';

/**
 * @description Generate a new interview report based on the provided resume, self-description, and job description
 */
export async function generateInterviewReportController(req, res) {
    try {
        const parser = new PDFParse({
            data: Uint8Array.from(req.file.buffer),
        });
        const result = await parser.getText();
        const resumeContent = result.text;
        const { selfDescription, jobDescription } = req.body;
        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            jobDescription,
            resume: resumeContent.text,
            selfDescription,
            ...interviewReportByAi
        })
        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        })
    } catch (error) {
        console.error("generateInterviewReport failed:", error);
        // Gemini overload / rate-limit -> surface as 503 so the client can retry
        if (error?.status === 503 || /unavailable|high demand/i.test(error?.message || "")) {
            return res.status(503).json({
                message: "The AI service is busy right now. Please try again in a moment.",
            });
        }
        return res.status(500).json({
            message: "Failed to generate interview report. Please try again.",
        });
    }

}
/**
 * @description Get interview report by interview id
 */
export async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;
    if (!interviewId) {
        return res.status(400).json({ message: "Please provide interview id" });
    }
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });
    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found" });
    }
    return res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReport
    });
}
/**
 * @description Get all interview reports of logged in user
 */
export async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -updatedAt -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");
    return res.status(200).json({
        message: "All interview reports fetched successfully",
        interviewReports
    });
}
/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
export async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params;
    const interviewReport = await interviewReportModel.findById(interviewReportId)
    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }
    const { resume, jobDescription, selfDescription } = interviewReport
    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })
    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })
    res.send(pdfBuffer)
}


