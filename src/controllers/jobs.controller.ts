import { Request, Response } from "express";
import { addJob } from "../services/jobs.service";

export const postJob = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const response = await addJob(req.user.id, req.body)

        return res.status(201).json({ message: "Job Added successfully!", data: response })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Resume parsing failed" });
    }
}