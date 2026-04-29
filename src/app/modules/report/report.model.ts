

import { Schema, model } from "mongoose";
import { IReport, reportType } from "./report.interface";

const ReportSchema = new Schema<IReport>(
    {
        type: {
            type: String,
            enum: Object.values(reportType),
            required: [true, "Report type is required"],
        },
        text: {
            type: String,
            required: [true, "Report description text is required"],
            trim: true,
            minlength: [5, "Report text must be at least 5 characters long"],
        },
        reporter: {
            type: Schema.Types.ObjectId,
            ref: "User", // Je report korche 
            required: [true, "Reporter ID is required"],
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User", // Jodi user ke report kora hoy
            default: null,
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post", // Jodi post ke report kora hoy
            default: null,
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Model create kora
const Report = model<IReport>("Report", ReportSchema);

export default Report;