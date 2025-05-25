import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin:["http://localhost:5173"],
        credentials: true
    }
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

// to store online users 
const userSocketMap = {}  // {userId: ,socketId: }

io.on("connection",(socket)=>{
    console.log("A user connected",socket.id); // socket.id unique is is assigned on connection 
    
    // user online 
    const userId = socket.handshake.query.userId;  // comming from authStore
    if(userId) userSocketMap[userId] = socket.id ;

    // emit to send from the server to client 
    io.emit("getOnlineUsers",Object.keys(userSocketMap));   // omly send userId as to display if online or offline 
    console.log(userSocketMap);

    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
    })
})

export { io, app , server}