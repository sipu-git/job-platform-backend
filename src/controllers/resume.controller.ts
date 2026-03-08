import { Request, Response } from "express";
import { processResume } from "../services/resume.service";

export const uploadResume = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Resume file required"
            });
        }
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID required"
            });
        }
        const parsedData = await processResume(userId, file)
        return res.status(201).json({ message: "Resume parsed successfully!", data: parsedData })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Resume parsing failed" });
    }
}