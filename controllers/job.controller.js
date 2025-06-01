import {Job} from "../models/job.model.js"; // import job model
import { Company } from "../models/company.model.js";
//admin post the jobs

export const postJob = async (req,res)=>{
    try {
        const{ title, description, requirements, salary , location , jobType , experience , position , companyId}= req.body;
        const userId= req.id;  //logged in user id
        const company = await Company.findById(companyId); // find company by id
        if(!company) {
            return res.status(404).json({ message: 'Company not found', success : false });
        }
        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId){
            return res.status(400).json({message: 'Please fill all the fields', success : false});
        };
        const job = await Job.create({ title, description, requirements : requirements.split(","), salary:Number(salary) , location , jobType , experienceLevel:experience , position , company : companyId,created_by :  userId});
        return res.status(201).json({ message: 'Job posted successfully', job, success : true });

    } catch (error) {
       
        res.status(500).json({ error: error.message });
        
    }
}


export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const orQueries = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { location: { $regex: keyword, $options: 'i' } },
      { jobType: { $regex: keyword, $options: 'i' } },
    ];

    const salaryNum = Number(keyword);
    if (!isNaN(salaryNum)) {
      orQueries.push({ salary: salaryNum });
    }

    const query = { $or: orQueries };

    const jobs = await Job.find(query)
      .populate('company')
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found', success: false });
    }
    
    return res.status(200).json({ message: 'Jobs found', jobs, success: true });

  } catch (error) {
    console.error("Error in getAllJobs:", error);
    res.status(500).json({ error: error.message });
  }
};

// export const getAllJobs = async (req, res) => {
//     try {
//       const keyword = req.query.keyword || "";
//       const query = {
//         $or: [
//           { title: { $regex: keyword, $options: 'i' } },
//           { description: { $regex: keyword, $options: 'i' } },
//           { location: { $regex: keyword, $options: 'i' } },
//           { jobType: { $regex: keyword, $options: 'i' } },
//         { salary: { $regex: keyword, $options: 'i' } },
//              ]
//       };
  
//       const jobs = await Job.find(query).populate({
//         path: 'company',
//       }).sort({ createdAt: -1 }); // find all jobs and populate company field, sort by createdAt in descending order
    
  
//       if (!jobs || jobs.length === 0) {
//         return res.status(404).json({ message: 'No jobs found', success: false });
//       }
//       else
//         return res.status(200).json({ message: 'Jobs found', jobs, success: true });
  
//     } catch (error) {
   
//       res.status(500).json({ error: error.message });
//     }
//   };
  

//for students to view the jobs by id
export const getJobById = async (req,res)=>{
    try {
        const jobId = req.params.id; // get job id from params
        const job = await Job.findById(jobId).populate({
            path: 'applications',
        }) // find job by id and populate company and created_by fields
        if (!job) {
            return res.status(404).json({ message: 'Job not found', success :false });
        }
        return res.status(200).json({ message: 'Job found', job, success : true });

    } catch (error) {
      
        res.status(500).json({ error: error.message });
        
    }
}

//for admin to view all the jobs posted by admin
export const getAdminJobs = async (req,res)=>{
    try {
        const adminId= req.id;  //logged in user id
        const jobs = await Job.find({created_by : adminId}).populate({path : 'company', createdAt:-1}); // find all jobs for the logged in user and populate company and created_by fields
        if (!jobs) {
            return res.status(404).json({ message: 'No jobs found', success :false });
        }
        return res.status(200).json({ message: 'Jobs found', jobs, success : true });

    } catch (error) {
    
        res.status(500).json({ error: error.message });
        
    }
}