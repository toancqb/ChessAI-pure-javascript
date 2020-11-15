
//var canvas = document.getElementById("canvas");
//var context = canvas.getContext("2d");




//_______________________________________________________//

//__________________________________________________________//

var game = null;

function init() {
    game = new Game();

    game.init();

    window.requestAnimationFrame(update);
}

function update() {
    
    game.update();
    
    window.requestAnimationFrame(update);
}


resources.onReady(init);
