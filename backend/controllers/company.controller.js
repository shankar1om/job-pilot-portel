import { company } from "../models/company.model.js"

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "company name is required",
                success: false
            })
        }
        let Company = await company.findOne({ name: companyName })
        if (Company) {
            return res.status(400).json({
                message: " you can not register same company.",
                success: false
            })
        }
        Company = await company.create({
            name: companyName,
            userId: req.id // here we are storing userId , for fetching companier or populating it is important
        })
        return res.status(201).json({
            message: "company registered successfully",
            Company,
            success: true
        })
    }
    catch (error) {
        console.log('error while  registering company', error)
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}


export const getCompany = async (req, res) => {
    try {
        const userId = req.id;  // logged in user id
        const companies = await company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "companies not found",
                success: false
            })
        }
        res.status(201).json({
            companies,
            success:true
        })
    }
    catch (error) {
        console.log('err while  getting companies', error)
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}


export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id; //    /:id---> params
        const Company = await company.findById(companyId)
        if (!company) {
            return res.status(404).json({
                message: "company not found",
                success: false
            })
        }
        return res.status(201).json({
            Company,
            success: true
        })
    }
    catch (error) {
        console.log('err while  getting company', error)
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;
        //claudinary

        const updateData = { name, description, website, location };
        const Company = await company.findByIdAndUpdate(req.params.id, updateData, { new: true }) // so that i get updated data
        if (!Company) {
            res.status(404).json({
                message: "company not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "company information updated",
            Company,
            success: true
        })
    }
    catch (error) {
        console.log('err while  updating company', error)
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}