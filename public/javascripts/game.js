

//Automatically request will be sent to server io.on
const socket = io();  //if the front is not in the same domain as server then you have to pass URL of server

const chess = new Chess();
const boardElement = document.querySelector(".chessboard");
const moveHistoryElement = document.getElementById("moveHistory");
let moveCount=1;

let draggedPiece =null;
let sourcePiece = null;
let playerRole = null;

const updateMoveHistory = (history) => {
    const moveHistoryElement = document.getElementById("moveHistory");
    moveHistoryElement.innerHTML = ""; // Clear previous history

    for (let i = 0; i < history.length; i += 2) {
        const moveRow = document.createElement("div");
        moveRow.classList.add("grid", "grid-cols-2", "gap-2", "p-1");

        const whiteMove = document.createElement("div");
        whiteMove.classList.add("bg-gray-700", "p-2", "rounded");
        whiteMove.innerHTML = `<strong>${Math.floor(i / 2) + 1}.</strong> ${history[i] || ""}`;

        const blackMove = document.createElement("div");
        blackMove.classList.add("bg-gray-600", "p-2", "rounded");
        blackMove.innerHTML = history[i + 1] || "";

        moveRow.appendChild(whiteMove);
        moveRow.appendChild(blackMove);
        moveHistoryElement.appendChild(moveRow);
    }
};

socket.on("moveHistory", (history) => {
    updateMoveHistory(history);
});


// document.getElementById("resetGame").addEventListener("click", () => {
//     socket.emit("resetGame");
// });

// socket.on("resetGame", () => {
//     chess.reset();
//     renderBoard();
// });

const renderBoard = ()=>{
    // Changing turn indicator
    const turnElement = document.getElementById("turn");
    socket.on("boardState", (fen) => {
        chess.load(fen);
        renderBoard();
        turnElement.textContent = chess.turn() === "w" ? "White" : "Black";
    });
    const board = chess.board();

  boardElement.innerHTML="";
  board.forEach((row, rowindex) => {
    row.forEach((square,squareindex)=>{
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "square",
        (rowindex+squareindex)%2===0 ? "light":"dark"
      );

      squareElement.dataset.row= rowindex;
      squareElement.dataset.col=squareindex;
      // if square isn't empty
      if(square)
        {
        const pieceElement= document.createElement("div");
        pieceElement.classList.add("piece", square.color==='w' ? "white" : "black");

        pieceElement.innerText = getPieceUnicode(square);
        pieceElement.draggable = playerRole===square.color;

        pieceElement.addEventListener("dragstart",(e)=>{
            if(pieceElement.draggable) {
                draggedPiece= pieceElement;
                sourceSquare={row:rowindex,col: squareindex};
                e.dataTransfer.setData("text/plain",""); // ensures no problem to come in drag
             }
          });

          pieceElement.addEventListener("dragend",(e)=>{
           draggedPiece= null;
           sourceSquare= null;
          });


          squareElement.appendChild(pieceElement);
        }

       squareElement.addEventListener("dragover",(e)=>{
            e.preventDefault(); // Don't do default functionalities of dragover
       });

       squareElement.addEventListener("drop",(e)=>{
        e.preventDefault();  // don't do default functionalities of drop
        if(draggedPiece){
            const targetSource={
                row: parseInt(squareElement.dataset.row),
                col: parseInt(squareElement.dataset.col)
            };
            handleMove(sourceSquare,targetSource);
        }
       });

       boardElement.appendChild(squareElement);
    });
  });
};

const handleMove = (source,target)=>{
  const move ={
    from: `${String.fromCharCode(97+source.col)}${8-source.row}`, //getting correct format of move e.g. ...(97+0)='a'
    to: `${String.fromCharCode(97+target.col)}${8-target.row}`,
    promotion: 'q' // if pawn reaches end it will be promoted to queen
  };

  socket.emit("move",move);
};

const getPieceUnicode = (piece)=>{
    const unicodePieces = {
        'p': '♟', // Black Pawn
        'n': '♞', // Black Knight
        'b': '♝', // Black Bishop
        'r': '♜', // Black Rook
        'q': '♛', // Black Queen
        'k': '♚', // Black King
        'P': '♙', // White Pawn
        'N': '♘', // White Knight
        'B': '♗', // White Bishop
        'R': '♖', // White Rook
        'Q': '♕', // White Queen
        'K': '♔', // White King
      };
      const key = piece.color === 'w' ? piece.type.toUpperCase() : piece.type;

      return unicodePieces[key] || "";
};

socket.on("playerRole",(role)=>{
   playerRole=role;
   renderBoard();
   if (role === "b") boardElement.classList.add("flipped");
});

 socket.on("spectator",()=>{
    playerRole = null;
    renderBoard();

 });
 
 socket.on("boardState",(fen)=>{

    const checkGameOver = () => {
        if (chess.isCheckmate()) {
            alert(`Checkmate! ${chess.turn() === "w" ? "Black" : "White"} wins.`);
            socket.emit("gameOver");
        } else if (chess.isDraw()) {
            alert("Game Drawn!");
            socket.emit("gameOver");
        }
    };
    
    socket.on("boardState", (fen) => {
        chess.load(fen);
        renderBoard();
        turnElement.textContent = chess.turn() === "w" ? "White" : "Black";
        checkGameOver();
    });
    
    socket.on("gameOver", () => {
        alert("Game over!");
    });

    chess.load(fen);
    renderBoard();
 });

 socket.on("move", (move) => {
    chess.move(move);
    renderBoard();
    
});

renderBoard();