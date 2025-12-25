
import { application} from '../models/application.model.js';
import  {job}  from './../models/job.model.js';

export const applyJob = async(req,res) => {
    try{
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                message:"job id is required",
                success : false
            })
        }
        // checking if user had already applied for theb job or not
        const existingApplication = await application.findOne({job:jobId,applicant:userId})
         if(existingApplication){
            return res.status(400).json({
                message:"you have already applied for this job",
                success : false
            })
        }
        //check if job exists
        const Job = await job.findById(jobId)
        if(!Job){
             return res.status(404).json({
                message:"job not found",
                success : false
            })
        }
        //create new application
        const newApplication = await application.create({
            job:jobId,
            applicant:userId
        })
        Job.application.push(newApplication._id)
        await Job.save();
        return res.status(201).json({
            message : "job applied success fully",
            success : true
        })
    }
  catch (error) {
        console.log('err while applying to the job', error)
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

export const getAppliedJobs = async(req,res)=>{
    try{
        const userId = req.id;
        const applications = await  application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:"job",//should be string necessarily
            options:{sort : {createdAt:-1}},
             //nested population
            populate:{
                path:"companyId",
                options:{sort : {createdAt:-1}}
            }
        })
        if(!applications){
            return res.status(404).json({
                message:"no application found",
                success : false
            })
        }
        res.status(200).json({
            applications,
            success:true
        })
    }
    catch (error) {
        console.log('err while getting applied job', error)
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

//to see admin how many applicants applied for the job
export const getApplicants = async(req,res)=>{
      try{
         const jobId = req.params.id;
         const Job = await job.findById(jobId).populate({
            path:"application",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"applicant",
            }
         })
         if(!Job){
             return res.status(404).json({
                message:"no one till now has applied for the job",
                success : false
            })
         }
         return res.status(200).json({
            Job,
            success:true
         })
      }
      catch (error) {
        console.log('err while getting applicants', error)
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}


export const updateStatus = async (req,res)=>{
    try{
        const{status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(404).json({
                message:"status is required",
                success : false
            })
        }

        //find application by application id
        const applicationOfApplicant = await application.findOne({_id:applicationId})
        if(!applicationOfApplicant){
            return res.status(404).json({
                message:"application not found",
                success : false
            })
        }
        //update the status
        applicationOfApplicant.status = status.toLowerCase();
        await applicationOfApplicant.save();

           return res.status(200).json({
            message:"status changed successfully",
            success:true
         })
    }
     catch (error) {
        console.log('err while updating status', error)
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}