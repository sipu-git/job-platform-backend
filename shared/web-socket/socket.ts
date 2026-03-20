import { Server } from "socket.io";

let io:Server;

export const setIO = (serverIO:Server)=>{
    io = serverIO;
}

export const getIO= ()=>{
    if(!io){
        throw new Error("socket is not initialized!")
    }
    return io;
}