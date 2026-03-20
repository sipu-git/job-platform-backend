import express from 'express'
import { uploadResume } from './resume.controller'
import multer from 'multer'
import { authMiddleware } from '../../shared/middleware/auth.middleware'

const router = express.Router()
const uploadDoc = multer({ storage: multer.memoryStorage() })

router.post("/add-resume",uploadDoc.single("resume"),authMiddleware,uploadResume)
export default router;