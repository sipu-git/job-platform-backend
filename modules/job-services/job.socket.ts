import { Server, Socket } from "socket.io";

export const jobSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("User recruiter connected!", socket.id);

        socket.on("join-recruiter-room", (recruiterId: string) => {
            socket.join(`recruiter-${recruiterId}`);
            console.log(`Recruiter-${recruiterId} joiined room!`);
        })
        socket.on("job-posted", (jobData) => {
            io.emit("new-job", jobData)
        })
        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id);
        })
    })
}