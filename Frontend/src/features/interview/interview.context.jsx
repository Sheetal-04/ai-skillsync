import { createContext, useState } from "react";
export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(false)              // generating / loading a single report
    const [reportsLoading, setReportsLoading] = useState(false) // loading the recent-reports list
    const [pdfLoading, setPdfLoading] = useState(false)        // generating the resume PDF
    const [reportError, setReportError] = useState(false)      // a single-report load failed
    const [reports, setReports] = useState([])
    return (
        <InterviewContext.Provider value={{
            report, setReport,
            loading, setLoading,
            reportsLoading, setReportsLoading,
            pdfLoading, setPdfLoading,
            reportError, setReportError,
            reports, setReports,
        }} >
            {children}
        </InterviewContext.Provider>
    )
}