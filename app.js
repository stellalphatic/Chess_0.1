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
let currentPlayer="w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public"))); // Setting static files location

app.get("/",(req,res)=>{
   res.render("index");
});

// Socket basically creates connection from frontend(client) to backend(server) socket
io.on("connection",(Socket)=>{
    console.log("connected");
   
    if(!players.white){
        players.white= Socket.id;
        Socket.emit("playerRole","w");
    }
    else if(!players.black){
        players.black= Socket.id;
        Socket.emit("playerRole","b");
    }
    else{
        Socket.emit("spectator");
    }

    // If any user exit or disconnects from server
    Socket.on("disconnect",()=>{
        if(Socket.id===players.white){
            delete players.white;
        }
        else if(Socket.id===players.black){
            delete players.black;
        }
    });

    // Validating moves
    Socket.on("move",(move)=>{
        try{
            // validating that move is from current player
            if(chess.turn()=== "w" && Socket.id !== players.white) return;
            if(chess.turn()=== "b" && Socket.id !== players.black) return;

           const isValid = chess.move(move);
           // if move is valid
           if(isValid){
            currentPlayer = chess.turn();
            io.emit("move",move);
            io.emit("boardState",chess.fen()) // Sending current state of board to evryone in FEN notation 
           }
           // if invalid move
           else{
             console.log("Invalid move : ",move);
             Socket.emit("invalidMove",move); // sending invalid move only to the person who made it
           }

        }
        catch(err){
            console.log(err);
            Socket.emit("invalidMove",move);
        }
    });
})







server.listen(3000,()=>{
    console.log("server started at port 3000");
});
