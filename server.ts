import express from 'express';
import resumeRoutes from './src/routes/resume.routes';
import userRoutes from './src/routes/user.routes';
// import jobRoutes from './src/routes/jobs.routes';

import cors from 'cors';

const app = express()
app.use(cors({
    origin:"*",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["POST", "GET", "PUT", "DELETE"]
}))
app.use(express.json())
app.use("/api/resume",resumeRoutes)
app.use("/api/auth",userRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`The server is running on ${PORT}`)
})