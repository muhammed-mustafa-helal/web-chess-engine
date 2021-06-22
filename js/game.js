
var squaresIDs = new Array(8);
var boardPieces = new Array(8);
var attackedWhitePieces = [];
var attackedBlackPieces = [];
var currentTurn = 0;
var isSinglePlayer = false; // 2 players or 1 (face the computer)
var difficultyDepth = 1; // for AI