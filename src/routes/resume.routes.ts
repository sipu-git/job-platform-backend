import express from 'express'
import { uploadResume } from '../controllers/resume.controller'
import multer from 'multer'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = express.Router()
const uploadDoc = multer({ storage: multer.memoryStorage() })

router.post("/add-resume",uploadDoc.single("resume"),authMiddleware,uploadResume)
export default router;