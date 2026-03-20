import express from 'express';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { getJob, getJobs, postJob, searchActiveJobs } from './jobs.controller';

const router = express.Router()

router.post("/post-job",authMiddleware,postJob)
router.post("/get-jobs",authMiddleware,getJobs)
router.post("/get-job/:jobId",authMiddleware,getJob)
router.post("/search-job",authMiddleware,searchActiveJobs)

export default router;