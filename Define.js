    
SIZE = 50;
WHITE = 'w';
BLACK = 'b';
TCOLOR = "";
COLOR_WHITE = "#ffffff";
COLOR_ORANGE = "#ff8e00";
COLOR_GRIS = "#918b7a";
COLOR_LIGHTGRIS = "#bab39e";
PLAYER = ["WHITE", "BLACK"];
PLAYER_TYPE = [WHITE, BLACK];
BOARD = [
    ['br','bn','bb','bq','bk','bb','bn','br'],
    ['bp','bp','bp','bp','bp','bp','bp','bp'],
    ['  ','  ','  ','  ','  ','  ','  ','  '],
    ['  ','  ','  ','  ','  ','  ','  ','  '],
    ['  ','  ','  ','  ','  ','  ','  ','  '],
    ['  ','  ','  ','  ','  ','  ','  ','  '],
    ['wp','wp','wp','wp','wp','wp','wp','wp'],
    ['wr','wn','wb','wq','wk','wb','wn','wr']
];


SRC_PIECES = {
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

function preCondCoord(px, py) {
    if (px >= 0 && px <= 7 && py >= 0 && py <= 7)
        return true;
    return false;
}

function SelecteS1_BoardSimulation(board, x, y) {
    if (board.simulation[x][y] == '  ')
        board.simulation[x][y] = '..';
    else if (board.simulation[x][y] != '..')
        board.simulation[x][y] = '.' + board.simulation[x][y];
}

function SelecteS1_Board(board, x, y, flag) {
    board.cells[x][y].marked = flag;
}

function DeselecteS1_BoardSimulation(board, x, y) {
    if (board.simulation[x][y] == '..')
        board.simulation[x][y] = '  ';
    else if (board.simulation[x][y].slice(0,2) == '.b' || board.simulation[x][y].slice(0,2) == '.w')
        board.simulation[x][y] = board.simulation[x][y].slice(1,3);
}

function removePieceFromList(piece, lst) {
    for (var i = 0; i < lst.length; i++) {
        if (piece.x == lst[i].x && piece.y == lst[i].y) {
            lst.splice(i, 1);
            break;
        }
    }
}

function removePieceFromLists(piece, board) {
    removePieceFromList(piece, board.pieces);
    removePieceFromList(piece, board.bpieces);
    removePieceFromList(piece, board.wpieces);
}

function addPieceToLists(piece, board) {
    board.pieces.push(piece);
    if (piece.type == BLACK)
        board.bpieces.push(piece);
    else
        board.wpieces.push(piece);
}

function createListThreatedForPawn(type, x, y) {
    var c = (type == WHITE) ? -1 : 1;
    var lst = [];
    if (preCondCoord(x+c, y-1))
        lst.push([x+c, y-1]);
    if (preCondCoord(x+c, y+1))
        lst.push([x+c, y+1]);
    return lst;
}


function isPinLst(lst, p) {
    for (var i = 0; i < lst.length; i++) {
        if (lst[i][0] == p[0] && lst[i][1] == p[1])
            return true;
    }
    return false;
}

function getKingPosition(board, type) {
    var k = type + 'k';
    var lst = (type == WHITE) ? board.wpieces : board.bpieces;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].key == k)
            return [lst[i].x, lst[i].y];
    }
    return [];
}

function getKingPosition2(boardsimulation, type) {
    var k = type + 'k';
    for (var i = 0; i < 8; i++)
        for (var j = 0; j < 8; j++) {
            if (boardsimulation[i][j] == k)
                return [i,j];
        }
    return [];
}

function getLstPiece(board, c) {
    var lst = [];

    for (var i = 0; i < board.pieces.length; i++) {
        if (board.pieces[i].key[1] == c)
            lst.push([board.pieces[i].x, board.pieces[i].y]);
    }
    return lst;
}