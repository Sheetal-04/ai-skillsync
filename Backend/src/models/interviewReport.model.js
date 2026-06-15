import mongoose from "mongoose";

/**
 *  @readonly User may provide as an input
 * - job description : String
 * - resume text : String
 * - self description : String
 *  @readonly Server will provide as an output
 * -matchScore : Number
 *  @readonly Server will provide as an output
 * - Technical questions :
 * [{
 *     question : "",
 *     intention : "",
 *     answer : "",
 *
 * }]
 * - Behavioral questions : 
 * [{
 *     question : "",
 *     intention : "",
 *     answer : "",
 * }]
 * - Skill gaps :
 *  [{
 *     skill : "",
 *     severity : {
 *         enum: ["low", "medium", "high"]
 *      },
 * },
 * 
 * }]
 * - Preparation plan : [{
 *      day: Number,
 *      focus: String,
 *      tasks: [String]
 * }]
 */
const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"],
    },
    intention: {
        type: String,
        required: [true, "Intention is required"],
    },
    answer: {
        type: String,
        required: [true, "Answer is required"],
    }
}, {
    _id: false,
});
const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Behavioral question is required"],
    },
    intention: {
        type: String,
        required: [true, "Intention is required"],
    },
    answer: {
        type: String,
        required: [true, "Answer is required"],
    }
}, {
    _id: false,
});
const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"],
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"],
    },
}, {
    _id: false,
});
const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"],
    },
    focus: {
        type: String,
        required: [true, "Focus is required"],
    },
    tasks: [{
        type: String,
        required: [true, "Task is required"],
    }],
}, {
    _id: false,
});
const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Please provide job description"],
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: [true, "Please provide title"]
    }
}, {
    timestamps: true,
});
const interviewReportModel = mongoose.model("interviewReports", interviewReportSchema);
export default interviewReportModel;
