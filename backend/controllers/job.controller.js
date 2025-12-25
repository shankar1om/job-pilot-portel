import { job } from './../models/job.model.js';
//admin post job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experienceLevel, position, companyId } = req.body;
        const userId = req.id;
        if (!title || !description || !requirements || !salary || !location || !jobType || !experienceLevel || !position || !companyId) {
            return res.status(400).json({
                message: "something is missing",
                success: false
            })
        }
        const Job = await job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel:Number(experienceLevel),
            position,
            companyId,
            createdBy: userId //same(admin)user can create multiple jobs
        })
        return res.status(201).json({
            message: "new job created successfully",
            Job,
            success: true
        });
    }
    catch (error) {
        console.log('error while  posting job', error)
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}
//student
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || ""
        const query = {//unaware
            $or: [
                { title: { $regex: keyword, $options: "i" } },//unaware
                { description: { $regex: keyword, $options: "i" } },
            ]
        }
        const Job = await job.find(query).populate({
            path:"companyId"
        }).sort({createdAt:-1})
        if (!Job) {
            return res.status(400).json({
                message: "job not found",
                success: false
            })
        }
        return res.status(200).json({
            Job,
            success: true
        })
    }
    catch (error) {
        console.log('error while  getting job', error)
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}
//student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const Job = await job.findById(jobId);
        if (!Job) {
            return res.status(400).json({
                message: "job not found",
                success: false
            })
        }
        return res.status(200).json({
            Job,
            success: true
        })
    }
    catch (error) {
        console.log('error while  getting job by id', error)
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

//till now how many job created by admin

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await job.find({ createdBy: adminId })
        if (!jobs) {
            return res.status(400).json({
                message: "jobs not found",
                success: false
            })
        }
        return res.status(200).json({
            jobs,
            success: true
        })
    }
    catch (error) {
        console.log('error while  getting admin jobs', error)
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}