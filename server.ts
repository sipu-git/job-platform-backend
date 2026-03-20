import express from 'express';
import resumeRoutes from './modules/document-service/resume.routes';
import userRoutes from './modules/auth-service/auth.routes';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { jobSocket } from './modules/job-services/job.socket';
import { setIO } from './shared/web-socket/socket';
import jobRoutes from './modules/job-services/jobs.routes';

const app = express()
app.use(cors({
    origin:"*",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["POST", "GET", "PUT", "DELETE"]
}))
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:"*",
    }
})
setIO(io)
jobSocket(io);
app.use("/api/resume",resumeRoutes)
app.use("/api/auth",userRoutes)
app.use("/api/jobs",jobRoutes)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`The server is running on ${PORT}`)
})