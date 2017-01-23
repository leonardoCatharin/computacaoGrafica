function limpaCanvas() {
    var altera_canvas = document.getElementById("canvas");
    altera_canvas.width = altera_canvas.width;
}

function criaLinha(){
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    context.fillRect(50, 25, 150, 1);
    context.stroke();
}