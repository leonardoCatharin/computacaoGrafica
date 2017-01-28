/*Globais*/
var arrayPontos = [];
var listaObjetos = [];
var idObjetos = 0;
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
    var btnRotacao = document.getElementById('BtnRotacao');

    canvas = document.getElementById('canvas');
    var rect = canvas.getBoundingClientRect();

    btnClear.addEventListener('click', function (e) {
        limpaCanvas();
    },false);

    btnLinha.addEventListener('click', function(e){
        habilitaFerramenta("linha");
        canvas.addEventListener('click',func = function(e) {

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

    btnRotacao.addEventListener('click', function (e){
        habilitaFerramenta("rotacao");
        canvas.addEventListener('click',func = function(e) {

            var ponto = {
                x : e.clientX - rect.left,
                y : e.clientY - rect.top
            };

            arrayPontos.push(ponto);
            if(arrayPontos.length == 2){
                rotacao(arrayPontos[0], arrayPontos[1], canvas, func);
                arrayPontos = [];
            }
        } ,false);
    }, false);

    btnTranslacao.addEventListener('click', function (e){
        habilitaFerramenta("translacao");
        canvas.addEventListener('click',func = function(e) {
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
    // listaObjetos = [];
    // idObjetos = 0;
}

/* Função utilizada para desenhar linhas no canvas;
*  Desenha e remove o cursor de desenho e desabilita a ferramenta de desenho*/
function criaLinha(p1, p2, canvas, func){
    var contexto = canvas.getContext('2d');
    contexto.moveTo(p1.x, p1.y);
    contexto.lineTo(p2.x, p2.y);
    contexto.stroke();

    listaObjetos.push({
        id: idObjetos++,
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
        id: idObjetos++,
        tipo: "triangulo",
        ponto1: p1,
        ponto2: p2,
        ponto3: p3
    });
    desabilitaFerramenta(canvas, func);
}

/* Função utilizada para desenhar retângulos no canvas;
 * Desenha e remove o cursor de desenho e desabilita a ferramenta de desenho*/
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

    listaObjetos.push({
        id: idObjetos++,
        tipo: "retangulo",
        ponto1: p1,
        ponto2: p2,
        ponto3: p3,
        ponto4: p4
    });
    desabilitaFerramenta(canvas, func);
}

function rotacao(p1R, p2R, canvas, func){
    var cliquePontos = [];
    var rect = canvas.getBoundingClientRect();

    desenhaAreaSelecao(p1R, p2R, canvas, func);

    destacaPontos(listaObjetosSelecionados,canvas);
    habilitaFerramenta("rotacao");

    /* Pega ponto de referência e ponto destino */
    canvas.addEventListener('click',func = function(e) {
        ponto = {
            x : e.clientX - rect.left,
            y : e.clientY - rect.top
        };

        cliquePontos.push(ponto);

        if(cliquePontos.length == 1){

            //receber aqui o angulo da rotação
            var angulo = 90;
            angulo = angulo * (Math.PI / 180);

             var matrizRotacao = [
                 [Math.cos(angulo), - Math.sin(angulo), 0],
                 [Math.sin(angulo), Math.cos(angulo), 0],
                 [0, 0, 1]];

            var dx = 0 - cliquePontos[0].x;
            var dy = 0 - cliquePontos[0].y;

            var matrizTranslacaoOrigem =
                [[1, 0, dx],
                    [0, 1, dy],
                    [0, 0, 1]
                ];

            var matrizTranslacaoDestino =
                [[1, 0, cliquePontos[0].x],
                    [0, 1, cliquePontos[0].y],
                    [0, 0, 1]
                ];

            listaObjetosSelecionados.forEach(function(objeto){
                var objAux = calcula(objeto, matrizTranslacaoOrigem);

                objAux = calcula(objAux, matrizRotacao);

                objAux = calcula(objAux, matrizTranslacaoDestino);

                listaObjetos.push(objAux);

                listaObjetos = listaObjetos.filter(function (valor) {
                     return valor.id != objeto.id;
                });
            });

            limpaCanvas();
            desenhaListaDeObjetos();

            listaObjetosSelecionados = [];
            cliquePontos = [];
        }
    } ,false);
}


function destacaPontos(obj,canvas){
    console.log(obj)
    var ctx = canvas.getContext('2d');
    ctx.arc(obj[0].ponto1.x, obj[0].ponto1.x, 10, 0, 360, true);
}

function translacao(p1A, p2A, canvas, func){
    var cliquePontos = [];
    var rect = canvas.getBoundingClientRect();

    desenhaAreaSelecao(p1A, p2A, canvas, func);

    habilitaFerramenta("translacao");

    /* Pega ponto de referência e ponto destino */
    canvas.addEventListener('click',func = function(e) {

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
                listaObjetos.push(calcula(objeto, matrizTranslacao));

                listaObjetos = listaObjetos.filter(function (valor) {
                    return valor.id != objeto.id;
                });
            });

            limpaCanvas();
            desenhaListaDeObjetos();

            listaObjetosSelecionados = [];
            cliquePontos = [];
        }
    } ,false);
}

/*Desenha no canvas todos os objetos da lista de objetos atual*/
function desenhaListaDeObjetos(){
    listaObjetos.forEach(function (Obj) {
        if(Obj.tipo == "linha"){
            criaLinha(Obj.ponto1, Obj.ponto2, canvas, func);
        } else if(Obj.tipo == "triangulo"){
            criaTriangulo(Obj.ponto1, Obj.ponto2, Obj.ponto3, canvas, func);
        } else if(Obj.tipo == "retangulo"){
            criaRetangulo(Obj.ponto1, Obj.ponto2, canvas, func);
        }
    });
}

/*Desenha área de seleção*/
function desenhaAreaSelecao(ponto1, ponto2, canvas, func){
    var contexto = canvas.getContext('2d');

    contexto.fillStyle = "rgba(0,0,0,.1)";
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
           if(atributo != "tipo" && atributo != "id" && !contidoSelecao(objeto[atributo])){
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

/*Efetua o cálculo da translção e retorna o objeto correto*/
function calcula(Obj, mT){
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

    c = [];

    for (i = 0; i < mT.length; i++) {
        r = [];
        for (j = 0; j < a[0].length; j++) {
            s = 0;
            for (k = 0; k < a.length; k++) {
                s += mT[i][k] * a[k][j];
            }
            r.push(s);
        }
        c.push(r);
    }

    if(Obj.tipo == "linha"){
        return {
            tipo : "linha",
            ponto1 : {
                id: idObjetos++,
                x: c[0][0],
                y: c[1][0]
            },
            ponto2 : {
                x: c[0][1],
                y: c[1][1]
            }
        }
    } else if(Obj.tipo == "triangulo"){
        return {
            id: idObjetos++,
            tipo : "triangulo",
            ponto1 : {
                x: c[0][0],
                y: c[1][0]
            },
            ponto2 : {
                x: c[0][1],
                y: c[1][1]
            },
            ponto3 : {
                x: c[0][2],
                y: c[1][2]
            }
        }
    } else if(Obj.tipo == "retangulo"){
        return {
            id: idObjetos++,
            tipo : "retangulo",
            ponto1 : {
                x: c[0][0],
                y: c[1][0]
            },
            ponto2 : {
                x: c[0][1],
                y: c[1][1]
            },
            ponto3 : {
                x: c[0][2],
                y: c[1][2]
            },
            ponto4: {
                x: c[0][3],
                y: c[1][3]
            }
        }
    }
}
