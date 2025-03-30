const express = require('express');
const socket = require('socket.io');
const http = require("http");
const {Chess} = require("chess.js"); // Getting Chess Class
const path = require('path');

const app = express();

const server = http.createServer(app);  //initializing http server
const io= socket(server);   // Socket requires Http Server

const chess = new Chess();

let players ={};
let currentPlayer="W";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public"))); // Setting static files location

app.get("/",(req,res)=>{
   res.render("index");
});

// Socket basically creates connection from frontend(client) to backend(server) socket
io.on("connection",(uniqueSocket)=>{
    console.log("connected");
   
    uniqueSocket.on("disconnect",()=>{
        console.log("disconnected");
    })
})







server.listen(3000,()=>{
    console.log("server started at port 3000");
});
