import { getAllInterviewReports, getInterviewReportById, generateInterviewReport, generateResumePdf } from '../services/interview.api.js'
import { useContext, useEffect } from 'react'
import { InterviewContext } from '../interview.context.jsx'
import { useParams } from "react-router"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }
    const { report, setReport, loading, setLoading, reports, setReports } = useContext(InterviewContext)
    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ resumeFile, selfDescription, jobDescription })
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            console.log(error)
            return null
        }
        finally {
            setLoading(false)
        }
    }
    const getReportById = async (interviewId) => {
        setLoading(true)
        try {
            const response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
        finally {
            setLoading(false)
        }
    }
    const getAllReports = async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
        finally {
            setLoading(false)
        }
    }
    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])
    return { report, loading, generateReport, getReportById, getAllReports, reports,getResumePdf }
}