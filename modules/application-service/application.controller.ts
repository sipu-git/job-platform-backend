import { Request, Response } from "express";
import { applyJob, viewApplications } from "./application.service";

export const applyJobs = async (req: Request, res: Response) => {
    try {
        const { jobId, resumeId } = req.body
        if (!req.user) {
            return res.status(401).json({ success: false, message: "unauthorized!" })
        }
        const candidateId = req.user.id;
        const response = await applyJob(candidateId, jobId, resumeId)
        return res.status(201).json({ message: "Job applied successfully!", data: response })
    } catch (error) {
        console.error("failed to apply job!");
        return res.status(500).json({ message: "failed to apply job!" })
    }
}

export const viewRecentApplications = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "unauthorized!" })
        }
        const results = await viewApplications(req.user.id)
        return res.status(200).json({ message: "applications fetched successfully!", data: results })
    } catch (error) {
        console.error("failed to fetch applications!");
        return res.status(500).json({ message: "failed to fetch applications!" })
    }
}