import express from 'express';
import { applyJob } from '../controllers/application.controller.js';
import { getApplicants } from '../controllers/application.controller.js';
import { getAppliedJobs } from '../controllers/application.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { updateApplicationStatus } from '../controllers/application.controller.js';


const router = express.Router();

router.route('/apply/:id').get(isAuthenticated, applyJob); // Apply for a job
router.route('/get').get(isAuthenticated, getAppliedJobs); // Get all applied jobs for the user
router.route('/:id/applicants').get(isAuthenticated, getApplicants); // Get applications for a specific job
router.route('/status/:id/update').put(isAuthenticated, updateApplicationStatus); // Update application status by admin

export default router;