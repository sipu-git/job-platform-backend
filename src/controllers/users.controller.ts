import { Request, Response } from "express";
import { createUser, signinUser, viewProfile } from "../services/users.service";
import { uploadAvtar } from "../services/s3.service";

export const registerUser = async (req: Request, res: Response) => {
    try {
        let avatarUrl;
        if (req.file) {
            avatarUrl = await uploadAvtar(req.file)
        }
        const response = await createUser({ ...req.body, avatarUrl });
        return res.status(201).json({ message: 'User account created successfully!', data: response })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, passwordHash } = req.body;
        const response = await signinUser(email, passwordHash)
        return res.status(201).json({ message: "User siginin successfully!", data: response })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const viewUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized user credentials!" })
        }
        const response = await viewProfile(userId)
        return res.status(200).json({ message: "User profile fetched successfully!", data: response })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}