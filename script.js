/*Globais*/
var arrayPontos = [];
var canvas;
var func;

/*Chamada da função Principal quando a página é carregada*/
window.onload = function() {
    main();
};

/*Função Principal*/
function main() {
    var btnClear = document.getElementById('BtnClear');
    var btnLinha = document.getElementById('BtnLinha');
    var btnTriangulo = document.getElementById('BtnTriangulo');
    var btnRetangulo = document.getElementById('BtnRetangulo');

    canvas = document.getElementById('canvas');

    btnClear.addEventListener('click', function (e) {
        limpaCanvas();
    },false);

    btnLinha.addEventListener('click', function(e){
        habilitaFerramenta("linha");
        canvas.addEventListener('click',func = function(e) {

            var rect = this.getBoundingClientRect();

            var ponto = {
                x : e.clientX - rect.left,
                y : e.clientY - rect.top
            };

            arrayPontos.push(ponto);
            if(arrayPontos.length == 2){
                criaLinha(arrayPontos[0], arrayPontos[1], canvas, func, rect);
                arrayPontos = [];
            }
        } ,false);

    }, false);

    btnTriangulo.addEventListener('click', function(e){
        habilitaFerramenta("triangulo");
        canvas.addEventListener('click',func = function(e) {

            var rect = this.getBoundingClientRect();

            var ponto = {
                x : e.clientX - rect.left,
                y : e.clientY - rect.top
            };

            arrayPontos.push(ponto);
            if(arrayPontos.length == 3){
                criaTriangulo(arrayPontos[0], arrayPontos[1], arrayPontos[2], canvas, func);
                arrayPontos = [];
            }
        } ,false);

    }, false);

    btnRetangulo.addEventListener('click', function(e){
         habilitaFerramenta("retangulo");
         canvas.addEventListener('click',func = function(e) {

             var rect = this.getBoundingClientRect();

             var ponto = {
                 x : e.clientX - rect.left,
                y : e.clientY - rect.top
            };

            arrayPontos.push(ponto);
            if(arrayPontos.length == 2){
                criaRetangulo(arrayPontos[0], arrayPontos[1], canvas, func, rect);
                arrayPontos = [];
            }
         } ,false);

     }, false);
}

/*Função para habilitar a ferramenta*/
function habilitaFerramenta(tool) {
    if(tool == "linha" || tool == "triangulo" || tool == "retangulo"){
        document.body.style.cursor = "crosshair";
    }
}

/*Comando para sair da ferramenta*/
 document.onkeypress = function(evt) {
     if(evt.key == "s"){
         desabilitaFerramenta();
     }
};

/*Função para desabilitar a ferramenta*/
 function desabilitaFerramenta(canvas, func) {
     canvas.removeEventListener('click', func, false);
     document.body.style.cursor = "auto";
 }

/*Função utilizada para resetar o Canvas*/
function limpaCanvas() {
    var altera_canvas = document.getElementById("canvas");
    altera_canvas.width = altera_canvas.width;
}

/*
* Função utilizada para desenhar linhas no canvas;
* Desenha e remove o cursor de desenho e desabilita a ferramenta de desenho*/
function criaLinha(p1, p2, canvas, func){
    var contexto = canvas.getContext('2d');
    contexto.moveTo(p1.x, p1.y);
    contexto.lineTo(p2.x, p2.y);
    contexto.stroke();

    desabilitaFerramenta(canvas, func);

}

function criaTriangulo(p1, p2, p3, canvas, func) {
    var contexto = canvas.getContext('2d');

    contexto.moveTo(p1.x, p1.y);
    contexto.lineTo(p2.x, p2.y);

    contexto.moveTo(p1.x, p1.y);
    contexto.lineTo(p3.x, p3.y);

    contexto.moveTo(p2.x, p2.y);
    contexto.lineTo(p3.x, p3.y);
    contexto.stroke();

    desabilitaFerramenta(canvas, func);
}

function criaRetangulo(p1, p2, canvas, func, rect){
    var contexto = canvas.getContext('2d');

    var p3 = {
        x : p1.x,
        y : p2.y
    };

    var p4 = {
        x : p2.x,
        y : p1.y
    };

    contexto.moveTo(p1.x, p1.y);
    contexto.lineTo(p3.x, p3.y);

    contexto.moveTo(p1.x, p1.y);
    contexto.lineTo(p4.x, p4.y);

    contexto.moveTo(p2.x, p2.y);
    contexto.lineTo(p3.x, p3.y);

    contexto.moveTo(p2.x, p2.y);
    contexto.lineTo(p4.x, p4.y);

    contexto.stroke();

    desabilitaFerramenta(canvas, func);
}
