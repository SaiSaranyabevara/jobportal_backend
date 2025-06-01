import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js"; // import user model
import getDataUri from "../utils/datauri.js";
import cloudinary from  "../utils/cloudinary.js"


export const  registerCompany = async (req, res) => {
    try {
        const userId = req.id; // get user id from request
        const user = await User.findById(userId); // find user by id
        if (!user) {
            return res.status(404).json({ message: 'User not found', success :false });
        }
        if (user.role !== 'recruiter') { // check if user is recruiter
            return res.status(403).json({ message: 'Only recruiter can register a company', success :false });
        }
        const {companyName} = req.body; 
        if(!companyName) {
            return res.status(400).json({ message: 'company name is required' , success :false });
        };
        let company = await Company.findOne({ name : companyName }); // check if company already exists
        if (company) {
            return res.status(400).json({ message: 'company already exists', success :false });
        }
        company = await Company.create({
            name : companyName,
            userId: req.id
        });
        return res.status(201).json({ message: 'company registered successfully', company, success : true });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: error.message });
        
    }
}

export const getCompany = async (req, res) => {
    try {
        const userId= req.id;  //logged in user id
        const companies = await Company.find({ userId }); // find all companies for the logged in user
        if (!companies) {
            return res.status(404).json({ message: 'No companies found', success :false });
        }
        return res.status(200).json({ message: 'companies found', companies, success : true });

    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: error.message });
        
    }
}


export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id; // get company id from params
        const company = await Company.findById(companyId); // find company by id
        if (!company) {
            return res.status(404).json({ message: 'Company not found', success :false });
        }
        return res.status(200).json({ message: 'Company found', company, success : true });

    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: error.message });
        
    }
}

export const updateCompany = async (req, res) => {
    try {
        const {name , description , website , location} = req.body; // get company details from body
        const file = req.file; // get file from request
        //here we get cloudinary url of the image
        const fileUri= getDataUri(file);
        const cloudResponse=await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;

        const updateData={name , description , website , location,logo};

        const companyId = req.params.id; // get company id from params 
       
         const company = await Company.findByIdAndUpdate(companyId,updateData, { new: true }); // find company by id and update it
        if (!company) {
            return res.status(404).json({ message: 'Company not found', success :false });
        }

        return res.status(200).json({ message: 'Company updated successfully', company, success : true });

    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: error.message });
        
    }
}

