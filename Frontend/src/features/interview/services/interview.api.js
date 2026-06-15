import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ resumeFile, selfDescription, jobDescription }) => {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);
    try {
        const response = await api.post("/api/interview/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        })
        return response.data
    } catch (err) {
        console.log(err)
        throw err
    }
}
/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    try {
        const response = await api.get(`/api/interview/report/${interviewId}`)
        return response.data
    } catch (err) {
        console.log(err)
    }
}
/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    try {
        const response = await api.get(`/api/interview/`)
        console.log('Response of all reports',response);
        return response.data
    } catch (err) {
        console.log(err)
    }
}
/**
 * @description Service to get resume pdf based on user self description, resume and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    try {
        const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`,null,{
            responseType: 'blob', // Important for handling binary data
        })
        return response.data
    } catch (err) {
        console.log(err)
    }
}