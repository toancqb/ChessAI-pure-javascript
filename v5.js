/*
 * TO DO LIST:
 * - Implement AI playing Black pieces (Algo Minimax)
 * - Implement Openning Book
 */

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var game = null;

function init() {
    game = new Game();

    game.init();
    // game.initAI();

    window.requestAnimationFrame(update);
}

function update() {
    
    game.update();
    // game.updateAI();
    
    window.requestAnimationFrame(update);
}

function player1VSplayer2() {
    
    resources.onReady(that.init());
}

function menu() {
    var boardInit = new Board(context);
    boardInit.draw(false);    
}

//resources.onReady(menu);
resources.onReady(init);

