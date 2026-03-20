import express from 'express'
import { loginUser, registerUser, viewUserProfile } from './auth.controller'
import multer from 'multer';
const uploadProfile = multer({ storage: multer.memoryStorage() })
const router = express.Router()
router.post("/user-register", uploadProfile.single("profiles"), registerUser);
router.post("/user-login", loginUser)
router.get("/view-profile", viewUserProfile)

export default router;