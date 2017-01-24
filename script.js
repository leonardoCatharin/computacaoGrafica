/*Globais*/
var arrayPontos = [];
var listaObjetos = [];
var listaObjetosSelecionados = [];
var canvas;
var func;
var areaSelecao;

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
    var btnTranslacao = document.getElementById('BtnTranslacao');

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

    btnTranslacao.addEventListener('click', function (e){
        habilitaFerramenta("translacao");
        canvas.addEventListener('click',func = function(e) {

            var rect = this.getBoundingClientRect();

            var ponto = {
                x : e.clientX - rect.left,
                y : e.clientY - rect.top
            };

            arrayPontos.push(ponto);
            if(arrayPontos.length == 2){
                translacao(arrayPontos[0], arrayPontos[1], canvas, func);
                arrayPontos = [];
            }
        } ,false);
    }, false);
}

/*Função para habilitar a ferramenta*/
function habilitaFerramenta(tool) {
    if(tool == "linha" || tool == "triangulo" || tool == "retangulo"){
        document.body.style.cursor = "crosshair";
    }else if(tool == "translacao"){
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

/* Função utilizada para desenhar linhas no canvas;
*  Desenha e remove o cursor de desenho e desabilita a ferramenta de desenho*/
function criaLinha(p1, p2, canvas, func){
    var contexto = canvas.getContext('2d');
    contexto.moveTo(p1.x, p1.y);
    contexto.lineTo(p2.x, p2.y);
    contexto.stroke();

    listaObjetos.push({
        tipo: "linha",
        ponto1: p1,
        ponto2: p2
    });
    desabilitaFerramenta(canvas, func);

}

/* Função utilizada para desenhar triângulos no canvas;
 * Desenha e remove o cursor de desenho e desabilita a ferramenta de desenho*/
function criaTriangulo(p1, p2, p3, canvas, func) {
    var contexto = canvas.getContext('2d');

    contexto.moveTo(p1.x, p1.y);
    contexto.lineTo(p2.x, p2.y);

    contexto.moveTo(p1.x, p1.y);
    contexto.lineTo(p3.x, p3.y);

    contexto.moveTo(p2.x, p2.y);
    contexto.lineTo(p3.x, p3.y);
    contexto.stroke();


    listaObjetos.push({
        tipo: "triangulo",
        ponto1: p1,
        ponto2: p2,
        ponto3: p3
    });
    desabilitaFerramenta(canvas, func);
}

/* Função utilizada para desenhar retângulos no canvas;
 * Desenha e remove o cursor de desenho e desabilita a ferramenta de desenho*/
function criaRetangulo(p1A, p2A, canvas, func, rect){
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

    listaObjetos.push({
        tipo: "retangulo",
        ponto1: p1,
        ponto2: p2,
        ponto3: p3,
        ponto4: p4
    });
    desabilitaFerramenta(canvas, func);
}

function translacao(p1, p2, canvas, func){
    var cliquePontos = [];
    var listaDeObjetosTransladados = [];

    desenhaAreaSelecao(p1A, p2A, canvas, func);

    habilitaFerramenta("translacao");

    /* Pega ponto de referência e ponto destino */
    canvas.addEventListener('click',func = function(e) {
        var rect = this.getBoundingClientRect();

        ponto = {
            x : e.clientX - rect.left,
            y : e.clientY - rect.top
        };

        cliquePontos.push(ponto);

        if(cliquePontos.length == 2){
            var dx = cliquePontos[1].x - cliquePontos[0].x;
            var dy = cliquePontos[1].y - cliquePontos[0].y;

            var matrizTranslacao = [[1, 0, dx],
                [0, 1, dy],
                [0, 0, 1]];

            listaObjetosSelecionados.forEach(function(objeto){
                listaDeObjetosTransladados.push(multiplicaMatriz(objeto, matrizTranslacao));
            });
            console.log(listaDeObjetosTransladados);


            //apaga do canvas objetos que estão la lista de objetos selecionados
            //redesenha objetos da lista de objetos transladados

            listaObjetosSelecionados = [];
            listaDeObjetosTransladados = [];
            cliquePontos = [];
        }
    } ,false);
}

/*Desenha área de seleção*/
function desenhaAreaSelecao(ponto1, ponto2, canvas, func){
    var contexto = canvas.getContext('2d');

    contexto.fillRect(
        ponto1.x,
        ponto1.y,
        ponto2.x - ponto1.x,
        ponto2.y - ponto1.y
    );

    var ponto3 = {
        x : ponto1.x,
        y : ponto2.y
    };

    var ponto4 = {
        x : ponto2.x,
        y : ponto1.y
    };

    areaSelecao = {
        ponto1: ponto1,
        ponto2: ponto2,
        ponto3: ponto3,
        ponto4: ponto4
    };

    selecionaObjetos();
    desabilitaFerramenta(canvas, func);
}

/*Seleciona objetos que foram SELECIONADOS COMPLETAMENTE*/
function selecionaObjetos(){
    listaObjetos.forEach(function (objeto, index, arr) {
        var flag = true;
        Object.keys(objeto).forEach(function (atributo, index, arr){
           if(atributo != "tipo" && !contidoSelecao(objeto[atributo])){
               flag = false;
           }
        });
         if(flag){
           listaObjetosSelecionados.push(objeto);
         }
    });
}

/*Verifica se o objeto está contido na seleção*/
function contidoSelecao(objeto){
    if(
        (objeto.x >= areaSelecao.ponto1.x) &&
        (objeto.x <= areaSelecao.ponto2.x) &&
        (objeto.y >= areaSelecao.ponto1.y) &&
        (objeto.y <= areaSelecao.ponto2.y)){

        return true;
    }

    return false;
}

/**/
function multiplicaMatriz(Obj, mT){
    if(Obj.tipo == "linha"){
        a = [
             [Obj.ponto1.x, Obj.ponto2.x],
             [Obj.ponto1.y, Obj.ponto2.y],
             [1, 1]
            ];
    } else if(Obj.tipo == "triangulo"){
        a = [
            [Obj.ponto1.x, Obj.ponto2.x, Obj.ponto3.x],
            [Obj.ponto1.y, Obj.ponto2.y, Obj.ponto3.y],
            [1, 1, 1]
        ];
    } else if(Obj.tipo == "retangulo"){
        a = [
            [Obj.ponto1.x, Obj.ponto2.x, Obj.ponto3.x, Obj.ponto4.x],
            [Obj.ponto1.y, Obj.ponto2.y, Obj.ponto3.y, Obj.ponto4.y],
            [1, 1, 1, 1]
        ];
    }

}