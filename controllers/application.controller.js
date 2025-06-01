import { Application } from '../models/application.model.js';
import { Job } from '../models/job.model.js';

export const applyJob = async (req, res) => {
    try {
        const userId =req.id;
        const jobId  = req.params.id;
        

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found', success: false });
        }

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({job: jobId,applicant: userId });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job', success: false });
        }

        // Create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });
        job.applications.push(newApplication._id); // Add the user to the job's applicants array
        await job.save(); // Save the job with the new applicant

        return res.status(201).json({ message: 'Job application submitted successfully', success: true, application: newApplication });

    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id; // Get the logged-in user's ID

        // Find all applications for the user and populate the job details
        const application = await Application.find({ applicant: userId }).sort({createdAt:-1}).populate({
            path:'job' ,
             options:{sort:{createdAt:-1}},
             populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
             }
            }); // Populate the job details

        if (!application || application.length === 0) {
            return res.status(404).json({ message: 'No applications found', success: false });
        }

        return res.status(200).json({ message: 'Applications found', success: true, application });

    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: error.message });
    }
}

//admin see the applications for a job

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id; // Get the job ID from the request parameters
        const job=await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant',
                options:{sort:{createdAt:-1}},
            }
        }); // Find the job by ID
        if (!job) {
            return res.status(404).json({ message: 'Job not found', success: false });
        }
        return res.status(200).json({ message: 'Applications found',job, success: true });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: error.message });
        
    }

}

export const updateApplicationStatus = async (req, res) => {
        try {
            const {status} = req.body; // Get the status from the request body
            const applicationId = req.params.id; // Get the application ID from the request parameters
            if(!status) {
                return res.status(400).json({ message: 'Status is required', success: false });
            }
            // Check if the application exists

            const application = await Application.findOne({_id:applicationId}); // Find the application by ID
            if (!application) {
                return res.status(404).json({ message: 'Application not found', success: false });
            }
            application.status = status.toLowerCase(); // Update the status of the application
            await application.save(); // Save the updated application
            return res.status(200).json({ message: 'Application status updated successfully', success: true, application });
        } catch (error) {
            // console.log(error);
            res.status(500).json({ error: error.message });
            
        }
}