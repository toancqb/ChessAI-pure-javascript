
function preCondCoord(px, py) {
    if (px >= 0 && px <= 7 && py >= 0 && py <= 7)
        return true;
    return false;
}

function getLstPiece(board, p) {
    var lst = [];
    for (var i = 0; i < 8; i++)
        for (var j = 0; j < 8; j++) {
            if (board[i][j][1] == p)
                lst.push([i,j]);
        }
    return lst;
}
