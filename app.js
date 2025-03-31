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
let moveHistory = []; 

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
        Socket.emit("moveHistory", moveHistory);
    }
  // Send  current board state and move history to the new user
    Socket.emit("boardState", chess.fen());
    Socket.emit("moveHistory", moveHistory);

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
            moveHistory.push(isValid.san);  //Storing move in history
            io.emit("move",move);
            io.emit("boardState",chess.fen()) // Sending current state of board to evryone in FEN notation 
            io.emit("moveHistory", moveHistory);  //Send updated move history to all clients

            if (chess.isCheckmate()) {
                io.emit("gameOver", `${chess.turn() === "w" ? "Black" : "White"} wins by Checkmate!`);
            } else if (chess.isDraw()) {
                io.emit("gameOver", "Game Draw!");
            }
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

    Socket.on("resetGame", () => {
        chess.reset(); // Reset board
        moveHistory = []; // Clear history
        io.emit("boardState", chess.fen()); // Update board for all players
        io.emit("moveHistory", moveHistory); // Clear move history for everyone
        io.emit("gameReset"); // Notify all players to reset
    });Socket.on("resetGame", () => {
        chess.reset();
        io.emit("resetGame");
    });
})
// socket.emit() - to send an event........  socket.on() - to receive(listen) and respond to an event







server.listen(3000,()=>{
    console.log("server started at port 3000");
});
