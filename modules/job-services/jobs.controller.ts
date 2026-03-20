import { Request, Response } from "express";
import { addJob, searchJob, viewJob, viewJobs } from "./jobs.service";

export const postJob = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const response = await addJob(req.user.id, req.body)

        return res.status(201).json({ message: "Job Posted successfully!", data: response })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Job posting failed!" });
    }
}

export const getJobs = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const findResponse = await viewJobs();
        return res.status(200).json({ success: true, message: "Jobs fetched successfully!", data: findResponse })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Jobs fetching failed!" });
    }
}

export const getJob = async (req: Request, res: Response) => {
    try {
        const jobId = req.params.jobId;
        if (!jobId || Array.isArray(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Job ID"
            });
        }
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required!" })
        }
        const getResponse = await viewJob(jobId);
        return res.status(200).json({ message: "Job fetched successfully!", data: getResponse })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Jobs fetching failed!" });
    }
}

export const searchActiveJobs = async (req: Request, res: Response) => {
    try {
        const { keyword, location, employmentType, minSalary, maxSalary, page, limit } = req.query;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const result = await searchJob({
            keyword: keyword as string,
            location: location as string,
            employmentType: employmentType as string,
            minSalary: minSalary ? Number(minSalary) : undefined,
            maxSalary: maxSalary ? Number(maxSalary) : undefined,
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10
        })
        return res.status(200).json({ message: "Searched jobs fetched successfully!", data: result })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Jobs searching failed!" });
    }
}

