// Tic Tac Toe Game Script

// Initialize game variables
const board = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // Represents the game board
const cellElements = document.getElementsByClassName("cell"); // HTML elements representing individual cells
const boardElement = document.querySelector(".cont"); // HTML element representing the game board container
const dropdown = document.querySelector(".dropdown"); // Dropdown menu for game mode selection
const scores = document.querySelector(".scores"); // HTML element displaying game scores
let Xturn = true; // Indicates whether it's X's turn or not
let aimode = true; // Indicates whether the game is against AI or not
let wins = document.getElementById("won"); // HTML element displaying the number of wins
let losses = document.getElementById("lost"); // HTML element displaying the number of losses
let draws = document.getElementById("draws"); // HTML element displaying the number of draws
let result = document.querySelector(".result");// HTML element to display who won.
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Handle user click on a cell
function clicked(i) {

  // Check if the cell is empty
  if (cellElements[i].classList.value == 'cell') {
    // Update the cell based on the current player (X or O)
    if (Xturn) {
      cellElements[i].classList.add('x');
      board[i] = 'X';
      boardElement.classList.remove('x');
      boardElement.classList.add('o');
    } else {
      cellElements[i].classList.add('o');
      board[i] = 'O';
      boardElement.classList.remove('o');
      boardElement.classList.add('x');
    }

    // Switch turns
    Xturn = !Xturn;

    // Check for game result
    let result = checkWin();
    if (result !== 2) {
      boardElement.classList = 'cont';
      gameover = true;

      // Update scores and reset the game after a delay
      if (result == 0 && aimode) {
        draws.innerHTML = parseInt(draws.innerHTML) + 1;
      }
      if (result == 1 && aimode) {
        wins.innerHTML = parseInt(wins.innerHTML) + 1;
      }
      if (result == -1 && aimode) {
        losses.innerHTML = parseInt(losses.innerHTML) + 1;
      }
      setTimeout(reset,1500)
    }

    // If it's the AI's turn, let it make a move
    if (!Xturn && aimode) {
      ai();
    }
  }
}

// Function to check for a winning combination
function checkWin() {
  for (let i = 0; i < 8; i++) {
    const [a, b, c] = winningCombinations[i];

    if (board[a] !== 0 && board[a] == board[b] && board[a] == board[c]) {
      // Highlight the winning cells
      cellElements[a].style.borderRadius = "35%";
      cellElements[b].style.borderRadius = "35%";
      cellElements[c].style.borderRadius = "35%";

      // Return the winner (1 for X, -1 for O)
      if (board[a] === "X"){
        result.innerHTML = "X WON!";
        return 1;
      }
      if (board[a] === "O"){
        result.innerHTML = "O WON!";
        return -1
      }
    }
  }

  // If no winner and the board is full, it's a draw
  if (!board.includes(0)) {
    result.innerHTML = "It's a Draw.";
    return 0;
  }

  // The game is ongoing
  return 2;
}

// Reset the game
function reset() {
  boardElement.classList.value = "cont x";
  for (let i = 0; i < 9; i++) {
    cellElements[i].classList = "cell";
    cellElements[i].style.borderRadius = 0;
    board[i] = 0;
  }
  Xturn = true;
  result.innerHTML = '';
  gameover = false; // Reset the gameover flag
}

// Function to toggle between game modes (Versus AI and Practice)
function changemode() {
  reset();
  if (aimode) {
    dropdown.innerHTML = "Practice Mode";
    scores.style.opacity = 0;
  } else {
    dropdown.innerHTML = 'AI Mode';
    scores.style.opacity = 1;
  }
  aimode = !aimode;
}

// Evaluate the current game state
function evaluate() {
  for (let i = 0; i < 8; i++) {
    const [a, b, c] = winningCombinations[i];

    if (board[a] !== 0 && board[a] == board[b] && board[a] == board[c]) {
      // Return the winner (1 for X, -1 for O)
      return board[a] === "X" ? 1 : -1;
    }
  }

  // If no winner and the board is full, it's a draw
  if (!board.includes(0)) {
    return 0;
  }

  // The game is ongoing
  return 2;
}

// AI makes a move using the minimax algorithm
function ai() {
  let evaluation = evaluate(board);
  if (evaluation !== 2) {
    return evaluation;
  }

  let bestMove;
  let bestScore = Infinity;

  // Try all possible moves and choose the best one
  for (let i = 0; i < 9; i++) {
    if (board[i] == 0) {
      board[i] = 'O';
      let score = minimax(board, true);
      board[i] = 0;

      // Update best move if the current score is better
      if (score < bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  // Simulate a click on the chosen cell
  cellElements[bestMove].click();
}

// Minimax algorithm for AI decision-making
function minimax(board, isMaximizing) {
  let evaluation = evaluate(board);
  if (evaluation !== 2) {
    return evaluation;
  }

  if (isMaximizing) {
    let bestScore = -2;
    for (let i = 0; i < 9; i++) {
      if (board[i] == 0) {
        board[i] = 'X';
        let score = minimax(board, false);
        board[i] = 0;
        bestScore = Math.max(bestScore, score);
      }
    }
    return bestScore;
  } else {
    let bestScore = 2;
    for (let i = 0; i < 9; i++) {
      if (board[i] == 0) {
        board[i] = 'O';
        let score = minimax(board, true);
        board[i] = 0;
        bestScore = Math.min(bestScore, score);
      }
    }
    return bestScore;
  }
}
