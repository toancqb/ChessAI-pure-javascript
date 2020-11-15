
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");


elemLeft = canvas.offsetLeft + canvas.clientLeft;
elemTop = canvas.offsetTop + canvas.clientTop;

board = new Array(
    ['br','bn','bb','bq','bk','bb','bn','br'],
    ['bp','bp','bp','bp','bp','bp','bp','bp'],
    ['  ','  ','  ','  ','  ','  ','  ','  '],
    ['  ','  ','  ','  ','  ','  ','  ','  '],
    ['  ','  ','  ','  ','  ','  ','  ','  '],
    ['  ','  ','  ','  ','  ','  ','  ','  '],
    ['wp','wp','wp','wp','wp','wp','wp','wp'],
    ['wr','wn','wb','wq','wk','wb','wn','wr']
);

boardTracker = new Array(
    ['br','bn','bb','bq','bk','bb','bn','br'],
    ['bp','bp','bp','bp','bp','bp','bp','bp'],
    ['  ','  ','  ','  ','  ','  ','  ','  '],
    ['  ','  ','  ','  ','  ','  ','  ','  '],
    ['  ','  ','  ','  ','  ','  ','  ','  '],
    ['  ','  ','  ','  ','  ','  ','  ','  '],
    ['wp','wp','wp','wp','wp','wp','wp','wp'],
    ['wr','wn','wb','wq','wk','wb','wn','wr']
);

debugMode = false;
SIZE = 50;
TURN = 0; // 0 = White / 1 = Black
MOVE = {
    originX: 0,
    originY: 0,
    targetX: 0,
    targetY: 0
};
STAGE = 0;
CASTLE_K = [1,1]; // 0 = White / 1 = Black
CASTLE_Q = [1,1]; // 0 = White / 1 = Black
EN_PASSANT = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
tcolor = "";
COLOR_WHITE = "#ffffff";
COLOR_ORANGE = "#ff8e00";
COLOR_GRIS = "#918b7a";
COLOR_LIGHTGRIS = "#bab39e";

var srcPieces = {
    'br': "assets/black_rook.png",
    'bn': "assets/black_knight.png",
    'bb': "assets/black_bishop.png",
    'bq': "assets/black_queen.png",
    'bk': "assets/black_king.png",
    'bp': "assets/black_pawn.png",
    'wr': "assets/white_rook.png",
    'wn': "assets/white_knight.png",
    'wb': "assets/white_bishop.png",
    'wq': "assets/white_queen.png",
    'wk': "assets/white_king.png",
    'wp': "assets/white_pawn.png"
};
    
function nextTurn() {
    TURN = 1 - TURN;
}


function addImageToBoard(key, px, py) {
    var imgP = resources.get(srcPieces[key]);
    px = px * SIZE;
    py = py * SIZE;
    context.drawImage(imgP, py, px);
    return imgP;
}

function drawRect(i,j,color) {
    var x = i*SIZE;
    var y = j*SIZE;
    context.fillStyle = color;
    context.fillRect(x, y, SIZE, SIZE);
}

function drawPieces() {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (board[i][j] != '  ' && board[i][j] != '..' && board[i][j] != '...' && board[i][j] != '.:') {          
                if (board[i][j].slice(0,2) == ".b" || board[i][j].slice(0,2) == ".w")
                    addImageToBoard(board[i][j].slice(1,3), i , j);
                else
                    addImageToBoard(board[i][j], i , j);                
            }
        }
    }
}

function drawBoardTrackerConsole() {
    for (var i = 0; i < 8; i++) {
        console.log(boardTracker[i]);
    }
}

function drawBoardConsole() {
    for (var i = 0; i < 8; i++) {
        console.log(board[i]);
    }
}

function kingPosition(bw) {
    var lst = [];
    for (var i = 0; i < 8; i++)
        for (var j = 0; j < 8; j++) {
            if ((board[i][j] == bw + 'k') || (board[i][j] == '.' + bw + 'k')) {
                lst.push(i); lst.push(j);
                return lst;
            }
        }
    return lst;
}

function isPositionChecked(bw, x, y) {
    var op = (bw == 'b') ? 'w' : 'b';
    var cells = [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];

}

function isChecked(bw, px, py) {
    var op = (bw == 'b') ? 'w' : 'b';
    processSelectedS1(px, py, false, true);
    var kp = kingPosition(op);
    if (op == 'w' && board[kp[0]][kp[1]] == ".wk") {
        clearPotentialMove();
        return 2;
    }
    else if (op == 'b' && board[kp[0]][kp[1]] == ".bk") {
        clearPotentialMove();
        return 1;
    }
    clearPotentialMove();
    return 0;
}

function preCondMovePiece(bw, x, y, px, py) {
    var op = (bw == 'b') ? 'w' : 'b';
    clearPotentialMove();
    var bfPiece = board[x][y], bfPiece2 = board[px][py];
    board[x][y] = '  ';
    board[px][py] = bfPiece;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (board[i][j][0] == op && isChecked(op, i, j)) { 
                board[x][y] = bfPiece;
                board[px][py] = bfPiece2;
                return false;            
            }
        }
    } 
    
    board[x][y] = bfPiece;
    board[px][py] = bfPiece2;
    return true;
}

function isPositionNotBeingChecked(bw, px, py) {
    var op = (bw == 'b') ? 'w' : 'b';
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (board[i][j][0] == op) {
                processSelectedS1(i,j,false, true);
                if (board[px][py] == '..') {
                    clearPotentialMove();
                    return false;
                }
                clearPotentialMove();
            }
        }
    }
    return true;
}


/**
 * Check if bw's King is not being checked
 * @param {char} bw 
 */
function isNotBeingChecked(bw) {
    var op = (bw == 'b') ? 'w' : 'b';
    var kp = kingPosition(bw);
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (board[i][j][0] == op) {
                processSelectedS1(i,j,false, true);
                if (board[kp[0]][kp[1]] == '.'+bw+'k') {
                    clearPotentialMove();
                    return false;
                }
                clearPotentialMove();
            }
        }
    }
    return true;
}

/**
 * Check if bw make op checkmate
 * @param {} bw 
 */
function isCheckMate(bw) {
    var op = (bw == 'b') ? 'w' : 'b';
    var lstMoves, tmp1, tmp2, flag = false;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (board[i][j][0] == op) {
                lstMoves = processSelectedS1(i,j,false,false);
                if (!lstMoves.length) continue;
                lstMoves.forEach((function(p) {
                    if (!flag && preCondMovePiece(op,i,j,p[0],p[1])) {
                        tmp1 = board[i][j]; tmp2 = board[p[0]][p[1]];
                        board[p[0]][p[1]] = tmp1;
                        board[i][j] = '  ';
                        if (isNotBeingChecked(op)) {
                            board[i][j] = tmp1; board[p[0]][p[1]] = tmp2;
                            flag = true;
                        }
                        board[i][j] = tmp1; board[p[0]][p[1]] = tmp2;
                    }
                }));
                if (flag) break;
            }
        }    
    }
    if (flag) return false;
    return true;
}

// Click Event Handler

function clearPotentialPiece(piece) {
    return (piece.slice(1,3));
}

function clearPotentialMove() {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (board[i][j] == '..' || board[i][j] == '...' || board[i][j] == '.:')
                board[i][j] = '  ';
            else if (board[i][j] != '  ' && board[i][j][0] == '.')
                board[i][j] = clearPotentialPiece(board[i][j]);
        }
    } 
}


function defaultLoopMove(bw, op, px, py, cells, moves, flag) {
    cells.forEach((function(c) {
        var x = px+c[0], y = py+c[1];
        while (preCondCoord(x,y) && board[x][y] == '  ') {
            if (flag) board[x][y] = '..';
            else moves.push([x,y]);
            x += c[0];
            y += c[1];
        }
        if (preCondCoord(x,y) && board[x][y][0] == op) {
            if (flag) board[x][y] = '.' + board[x][y];
            else moves.push([x,y]);
        }
    }));
    if (debugMode)
        drawBoardConsole();
}

function defaultOnceMove(bw, op, px, py, cells, moves, flag) {
    
    cells.forEach((function(c) {
        var x = px + c[0], y = py + c[1];
        if (preCondCoord(x, y)) {
            if (board[x][y] == '  ') {
                if (flag) board[x][y] = '..';
                else moves.push([x,y]);
            }
            else if (board[x][y][0] == op) {
                if (flag) board[x][y] = '.' + board[x][y];
                else moves.push([x,y]);
            }
        }
    }));
    if (debugMode)
        drawBoardConsole();
}

function pawnMove(bw, x, y, moves, flag) {
    var pInit = 6, z = -1, op = 'b';
    if (bw == 'b') {
        pInit = 1; z = 1;  op = 'w'
    }
    var k = x + z;
    if (x == pInit) {        
        if (board[k][y] == '  ') {
            if (board[k+z][y] == '  ') {
                if (flag) {
                    board[k][y] = '..';
                    board[k+z][y] = '..';
                } else {
                    moves.push([k,y]);
                    moves.push([k+z,y]);
                }
            }
            else {
                if (flag) board[k][y] = '..';
                else moves.push([k, y]);
            }
        }
    } else if (preCondCoord(k, y) && board[k][y] == '  ') {
        if (flag) board[k][y] = '..';
        else moves.push([k, y]);
    }

    if (preCondCoord(k, y-1) && board[k][y-1][0] == op) {
        if (flag) board[k][y-1] = '.' + board[k][y-1];
        else moves.push([k, y-1]);
    }
    if (preCondCoord(k, y+1) && board[k][y+1][0] == op) {
        if (flag) board[k][y+1] = '.' + board[k][y+1];
        else moves.push([k, y+1]);
    }
    var t = (op == 'w') ? 0 : 1;
    if (preCondCoord(k, y-1) && preCondCoord(x, y-1) && board[x][y-1][0] == op && board[k][y-1] == '  ' && EN_PASSANT[t][y-1]) {
        if (flag) board[k][y-1] = '...';
        else moves.push([k, y-1]);
    }
    if (preCondCoord(k, y+1) && preCondCoord(x, y+1) && board[x][y+1][0] == op && board[k][y+1] == '  ' && EN_PASSANT[t][y+1]) {
        if (flag) board[k][y+1] = '...';
        else moves.push([k, y+1]);
    }
    if (debugMode)
        drawBoardConsole();
}

function kingMove(bw, px, py, moves, flag) {
    var op = (bw == 'w') ? 'b' : 'w';
    //var xpos = (bw == 'w') ? 7 : 0;
    var cells = [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];
   /* if (CASTLE_K[TURN] && board[px][py+1] == '  ' && board[px][py+2] == '  ' 
    && isPositionNotBeingChecked(bw, px, py+1) && isPositionNotBeingChecked(bw, px, py+2)) {       
            if (flag) board[px][py+2] = '.:';
            else moves.push([px,py+2]);
        }
    
    if (CASTLE_Q[TURN] && board[px][py-1] == '  ' && board[px][py-2] == '  ' && board[px][py-3] == '  '
    && isPositionNotBeingChecked(bw, px, py-1) && isPositionNotBeingChecked(bw, px, py-2)) {       
            if (flag) board[px][py-2] = '.:';
            else moves.push([px,py-2]);
        }*/
    defaultOnceMove(bw,op,px,py,cells, moves, flag);

    console.log("king selected");
//    console.log(isPositionNotBeingChecked(bw, px, py+1),isPositionNotBeingChecked(bw, px, py+2))
}

function knightMove(bw, px, py, moves, flag) {
    var op = (bw == 'w') ? 'b' : 'w';
    var cells = [[-2,-1],[-2,1],[2,-1],[2,1],[-1,-2],[-1,2],[1,-2],[1,2]];
    defaultOnceMove(bw,op,px,py,cells, moves, flag);
}

function rookMove(bw, px, py, moves, flag) {
    var op = (bw == 'w') ? 'b' : 'w';
    var cells = [[-1,0],[1,0],[0,-1],[0,1]];
    defaultLoopMove(bw,op,px,py,cells, moves, flag);
}

function bishopMove(bw, px, py, moves, flag) {
    var op = (bw == 'w') ? 'b' : 'w';
    var cells = [[-1,-1],[-1,1],[1,-1],[1,1]];
    defaultLoopMove(bw,op,px,py,cells, moves, flag);
}

function queenMove(bw, px, py, moves, flag) {
    var op = (bw == 'w') ? 'b' : 'w';
    var cells = [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];
    defaultLoopMove(bw,op,px,py,cells, moves, flag);
}

function processSelectedS1(px, py, flag, flag2)  {
    var moves = [];
    if (flag) {
        STAGE = 1;
        MOVE.originX = px;
        MOVE.originY = py;
    }
    switch(board[px][py]) {
        case 'bp':
            pawnMove('b', px, py, moves, flag2); break;
        case 'br':
            rookMove('b', px, py, moves, flag2); break;
        case 'bn':
            knightMove('b', px, py, moves, flag2); break;
        case 'bb':
            bishopMove('b', px, py, moves, flag2); break;
        case 'bq':
            queenMove('b', px, py, moves, flag2); break;
        case 'bk':
            kingMove('b', px, py, moves, flag2); break;
        case 'wp':
            pawnMove('w', px, py, moves, flag2); break;
        case 'wr':
            rookMove('w', px, py, moves, flag2); break;
        case 'wn':
            knightMove('w', px, py, moves, flag2); break;
        case 'wb':
            bishopMove('w', px, py, moves, flag2); break;
        case 'wq':
            queenMove('w', px, py, moves, flag2); break;
        case 'wk':
            kingMove('w', px, py, moves, flag2); break;
        default:
            break;
    }
    return moves;
}

function game_over(bw) {
    var pp = (bw == 'w') ? "WHITE" : "BLACK";
    var MSG = "CONGRATULATIONS!\n"+pp+" WON !";
    var MSG2 = "CONGRATULATIONS!";
    alert(MSG); 
    var p2 = document.getElementById("winner");
    p2.innerHTML = MSG2;
}

function updateCondPawnEnPassant() {
    var c = (TURN == 0) ? -2 : 2;
    if (MOVE.targetY == MOVE.originY && MOVE.originX + c == MOVE.targetX) {
        EN_PASSANT[TURN][MOVE.targetY] = 2;
    } else {
        EN_PASSANT[TURN][MOVE.targetY] = 0;
    }
}

function updateCondCastle(x,y) {
    if (board[x][y][1] == 'k') {
        CASTLE_K[TURN] = 0;
        CASTLE_Q[TURN] = 0;
    } else {
        if (y == 0) CASTLE_Q[TURN] = 0;
        if (y == 7) CASTLE_K[TURN] = 0;
    }
}

function updateGlobal(x, y) {    
    var lstPawn = getLstPiece(board, 'p');
    lstPawn.forEach((function(p) {
        if (EN_PASSANT[TURN][p[1]] > 0)
            EN_PASSANT[TURN][p[1]]--;
        if (EN_PASSANT[1-TURN][p[1]] > 0)
            EN_PASSANT[1-TURN][p[1]]--;
    }));
    if (board[x][y][1] == 'p')
        updateCondPawnEnPassant();
    if (board[x][y][1] == 'r' || board[x][y][1] == 'k')
        updateCondCastle(x, y);
}

function updateBoardTracker() {
    
}

function movingPiece() {   
    var bw = (TURN == 0) ? 'w' : 'b';
    var op = (bw == 'w') ? 'b' : 'w';
    var i = MOVE.originX, j = MOVE.originY, x = MOVE.targetX, y = MOVE.targetY;
    var tmp = board[x][y];

    if (preCondMovePiece(board[i][j][0], i, j, x, y)) {
        
        var c = (bw == 'w') ? 1 : -1;
        board[x][y] = board[i][j];
        board[i][j] = '  ';
        boardTracker[x][y] = boardTracker[i][j];
        boardTracker[i][j] = '  ';
        if (tmp == '...') {
            board[x+c][y] = '  ';
            boardTracker[x+c][y] = '  ';
        }
        updateGlobal(x, y);
        
        if (isChecked(bw, x, y) && isCheckMate(bw)){        
            game_over(bw);            
        }
        drawBoardTrackerConsole();
        return true;
    } else {
        STAGE = 0;
        return false;
    }
}

function processSelectedS2(px, py) {
    MOVE.targetX = px;
    MOVE.targetY = py;
    if (movingPiece()) {
        clearPotentialMove();
        STAGE = 0;
        nextTurn();
    }
}

function preCondSelectedS1(px, py) {
    if (board[px][py] != '  ') {
        if ((TURN == 0 && board[px][py][0] == 'w') || (TURN == 1 && board[px][py][0] == 'b')) {
            return true;
        }
    }
    return false;
}

function preCondSelectedS2(px, py) {
    if (board[px][py][0] == '.')
        return true;
    else if ((TURN == 0 && board[px][py][0] == 'w') || (TURN == 1 && board[px][py][0] == 'b')) {
        clearPotentialMove();
        processSelectedS1(px, py, true, true);
        STAGE = 1;
        return false;
    }
    STAGE = 0;
    clearPotentialMove();
    return false;
}

function handlerClick(e) {
    var px = Math.floor((e.pageY - elemTop) / SIZE);
    var py = Math.floor((e.pageX - elemLeft)/ SIZE);
    if (debugMode)
        console.log(board[px][py], px, py);
    if (STAGE == 0 && preCondSelectedS1(px, py)) {
        processSelectedS1(px, py, true, true);
    }
    else if (STAGE == 1 && preCondSelectedS2(px, py)) {
        processSelectedS2(px, py);
    }
}

canvas.addEventListener("click", handlerClick);
//__________________________________________________________//


function drawBoard() {
    elemLeft = canvas.offsetLeft + canvas.clientLeft;
    elemTop = canvas.offsetTop + canvas.clientTop;

    for (var i = 0; i < 8; i++) 
        for (var j = 0; j < 8; j++) {
            
            if (board[i][j][0] == '.') {
                color = ((i+j)%2) ? COLOR_GRIS : COLOR_LIGHTGRIS;                    
            } else {
                color = ((i+j)%2) ? COLOR_ORANGE : COLOR_WHITE;
            }
            drawRect(j, i, color);
    }
}


function init() {
    drawBoard();
    drawPieces();
    if (debugMode)
        drawBoardConsole();

    window.requestAnimationFrame(update);
}

function update() {
    context.clearRect(0,0,400,400);
    
    drawBoard();
    drawPieces();
    
    window.requestAnimationFrame(update);
}

resources.onReady(init);
