import { getAllInterviewReports, getInterviewReportById, generateInterviewReport, generateResumePdf } from '../services/interview.api.js'
import { useContext, useEffect } from 'react'
import { InterviewContext } from '../interview.context.jsx'
import { useParams } from "react-router"
import toast from 'react-hot-toast'

const errorMessage = (error, fallback) => error?.response?.data?.message || fallback

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }
    const {
        report, setReport,
        loading, setLoading,
        reportsLoading, setReportsLoading,
        pdfLoading, setPdfLoading,
        reportError, setReportError,
        reports, setReports,
    } = useContext(InterviewContext)
    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ resumeFile, selfDescription, jobDescription })
            setReport(response.interviewReport)
            toast.success('Your interview plan is ready!')
            return response.interviewReport
        } catch (error) {
            console.log(error)
            toast.error(errorMessage(error, 'Failed to generate interview plan. Please try again.'))
            return null
        }
        finally {
            setLoading(false)
        }
    }
    const getReportById = async (interviewId) => {
        setLoading(true)
        setReportError(false)
        try {
            const response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
            return true
        } catch (error) {
            console.log(error)
            setReportError(true)
            toast.error(errorMessage(error, 'Could not load this interview report.'))
            return false
        }
        finally {
            setLoading(false)
        }
    }
    const getAllReports = async () => {
        setReportsLoading(true)
        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return true
        } catch (error) {
            console.log(error)
            toast.error(errorMessage(error, 'Could not load your recent plans.'))
            return false
        }
        finally {
            setReportsLoading(false)
        }
    }
    const getResumePdf = async (interviewReportId) => {
        setPdfLoading(true)
        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
            toast.success('Resume downloaded.')
        }
        catch (error) {
            console.log(error)
            toast.error('Could not generate your resume PDF. Please try again.')
        } finally {
            setPdfLoading(false)
        }
    }
    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getAllReports()
        }
    }, [interviewId])
    return { report, loading, reportsLoading, pdfLoading, reportError, generateReport, getReportById, getAllReports, reports, getResumePdf }
}