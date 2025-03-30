

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
        pieceElement.innerText = "";
        pieceElement.draggable= playerRole===square.color;
        pieceElement.addEventListener("dragstart",()=>{
            if(pieceElement.draggable) {
                draggedPiece= pieceElement;
                sourcePiece={row:rowindex,col: squareindex};
             }
          });
        }
    });
  });
};

const handleMove = ()=>{

};

const getPieceUnicode = ()=>{

};

renderBoard();