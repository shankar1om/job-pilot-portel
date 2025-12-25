import mongoose from "mongoose";

const jobSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    salary: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    experienceLevel:{
        type:Number,
        required:true
    },
    jobType: {
        type: String,
        required: true
    },
    requirements: {
        type: [String],
        required: true
    },
    position: {
        type: String,
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    application:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Application',
        }
    ]
},{timestamps : true})

export const job = mongoose.model('Job',jobSchema);