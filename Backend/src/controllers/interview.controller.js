import { request } from "express";
import generateInterviewReport from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";
import { PDFParse } from 'pdf-parse';

export async function generateInterviewReportController(req, res) {
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
}  