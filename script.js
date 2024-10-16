const boxes = document.querySelectorAll(".box");
const resetBtn = document.getElementById("reset");
const switchModeBtn = document.getElementById("switchMode");
const infoText = document.querySelector(".info h2");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const overlay = document.getElementById("overlay");
const winMessage = document.getElementById("winMessage");
const closeOverlayBtn = document.getElementById("closeOverlay");
let music = new Audio("./music.mp3");
let turn = "X";
let gameOver = false;
let scores = { X: 0, O: 0 };
let singlePlayerMode = false;

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const changeTurn = () => turn === "X" ? "O" : "X";

const checkWin = () => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (boxes[a].innerText && boxes[a].innerText === boxes[b].innerText && boxes[a].innerText === boxes[c].innerText) {
      return boxes[a].innerText;
    }
  }
  return null;
};

const isBoardFull = () => {
  return [...boxes].every(box => box.innerText !== "");
};

const displayWinner = (winner) => {
  gameOver = true;
  scores[winner]++;

  music.play();
  if (singlePlayerMode && winner === "O") {
    winMessage.innerText = "Bad Luck! You have lost the game";
  } else {
    winMessage.innerText = `Congratulations ${winner}, You Have Won the Game!`;
  }
  overlay.style.display = "flex";
  scoreX.innerText = scores.X;
  scoreO.innerText = scores.O;
};

const aiMove = () => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (boxes[a].innerText === "" && boxes[b].innerText === turn && boxes[c].innerText === turn) {
      return boxes[a];
    }
    if (boxes[a].innerText === turn && boxes[b].innerText === "" && boxes[c].innerText === turn) {
      return boxes[b];
    }
    if (boxes[a].innerText === turn && boxes[b].innerText === turn && boxes[c].innerText === "") {
      return boxes[c];
    }
  }
  const opponent = changeTurn();
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (boxes[a].innerText === "" && boxes[b].innerText === opponent && boxes[c].innerText === opponent) {
      return boxes[a];
    }
    if (boxes[a].innerText === opponent && boxes[b].innerText === "" && boxes[c].innerText === opponent) {
      return boxes[b];
    }
    if (boxes[a].innerText === opponent && boxes[b].innerText === opponent && boxes[c].innerText === "") {
      return boxes[c];
    }
  }
  if (boxes[4].innerText === "") {
    return boxes[4];
  }
  const corners = [0, 2, 6, 8];
  for (let corner of corners) {
    if (boxes[corner].innerText === "") {
      return boxes[corner];
    }
  }
  for (let box of boxes) {
    if (box.innerText === "") {
      return box;
    }
  }
};

const handleClick = (e) => {
  const box = e.target;
  if (box.innerText === "" && !gameOver) {
    box.innerText = turn;
    let click = new Audio("./tick.mp3");
    click.play();
    const winner = checkWin();
    if (winner) {
      displayWinner(winner);
    } else if (isBoardFull()) {
      winMessage.innerText = "It's a Tie!";
      overlay.style.display = "flex";
      gameOver = true;
    } else {
      turn = changeTurn();
      infoText.innerText = `It is now ${turn}'s turn`;

      if (singlePlayerMode && turn === "O" && !gameOver) {
        const aiBox = aiMove();
        aiBox.innerText = turn;
        const winner = checkWin();
        if (winner) {
          displayWinner(winner);
        } else if (isBoardFull()) {
          winMessage.innerText = "It's a Tie!";
          overlay.style.display = "flex";
          gameOver = true;
        } else {
          turn = changeTurn();
          infoText.innerText = `It is now ${turn}'s turn`;
        }
      }
    }
  }
};

const resetGame = () => {
  boxes.forEach(box => box.innerText = "");
  turn = "X";
  gameOver = false;
  infoText.innerText = `It is now ${turn}'s turn`;
};

const switchMode = () => {
  singlePlayerMode = !singlePlayerMode;
  switchModeBtn.innerText = singlePlayerMode ? "Switch to Two Players" : "Switch to Single Player";
  resetGame();
};

boxes.forEach(box => box.addEventListener("click", handleClick));
resetBtn.addEventListener("click", resetGame);
switchModeBtn.addEventListener("click", switchMode);
closeOverlayBtn.addEventListener("click", () => {
  music.pause();
  music.currentTime = 0;
  overlay.style.display = "none";
  resetGame();
});