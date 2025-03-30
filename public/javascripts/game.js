

//Automatically request will be sent to server io.on
const socket = io();  //if the front is not in the same domain as server then you have to pass URL of server

const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece =null;
let sourcePiece = null;
let playerRole = null;

const renderBoard = ()=>{
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
                sourcePiece={row:rowindex,col: squareindex};
                e.dataTransfer.setData("text/plain",""); // ensures no problem to come in drag
             }
          });

          pieceElement.addEventListener("dragend",(e)=>{
           draggedPiece= null;
           sourcePiece= null;
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

const handleMove = ()=>{

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

renderBoard();