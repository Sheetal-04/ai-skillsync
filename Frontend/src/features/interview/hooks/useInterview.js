import {getAllInterviewReports, getInterviewReportById, generateInterviewReport} from '../services/interview.api.js'
import { useContext } from 'react'
import { InterviewContext } from '../interview.context.jsx'

export const useInterview = () => {
    const context = useContext(InterviewContext)
    if(!context){
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
    return { report, loading, generateReport, getReportById, getAllReports, reports }
}