
function preCondCoord(px, py) {
    if (px >= 0 && px <= 7 && py >= 0 && py <= 7)
        return true;
    return false;
}

/*
function isChecked(bw, px, py) {
    var op = (bw == 'b') ? 'w' : 'b';
    processSelectedS1(px, py, false);
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
                board[px][py] = '  ';
                clearPotentialMove();               
                return false;            
            }
        }
    } 
    
    board[x][y] = bfPiece;
    board[px][py] = '  ';
    clearPotentialMove();
    return true;
}

function preCondMovePiece2(bw, x, y, px, py) {
    var op = (bw == 'b') ? 'w' : 'b';
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
    board[px][py] = '  ';
    return true;
}

function isCheckedMate(bw) {
    var op = (bw == 'b') ? 'w' : 'b';
    var tmp;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (board[i][j][0] == op) {
                processSelectedS1(i, j, false);
                for (var x = 0; x < 8; x++) 
                    for (var y = 0; y < 8; y++) {
                        if (board[x][y] == '..' && preCondMovePiece2(op,i,j,x,y)) {
                            clearPotentialMove();
                            tmp = board[i][j];
                            board[x][y] = board[i][j];
                            board[i][j] = '  ';
                            if (isChecked)
                            return false; 
                        }                     
                    }
                clearPotentialMove();                           
            }
        }
    }
    clearPotentialMove();
    return true;
}

*/