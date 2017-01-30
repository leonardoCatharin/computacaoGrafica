/*Globais*/
var arrayPontos = [];
var listaObjetos = [];
var idObjetos = 0;
var listaObjetosSelecionados = [];
var canvas;
var func;
var areaSelecao;
var botoes;
var btnAtivo;

/*Chamada da função Principal quando a página é carregada*/
window.onload = function () {
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
    var btnAplicarRotacao = document.getElementById('BtnAplicarRotacao');
    var btnEscala = document.getElementById('BtnEscala');
    var btnAplicarEscala = document.getElementById('BtnAplicarEscala');

    botoes = [btnClear, btnLinha, btnTriangulo, btnRetangulo,
        btnTranslacao, btnRotacao, btnEscala];

    canvas = document.getElementById('canvas');

    btnClear.addEventListener('click', function () {
        resetaCanvas();
        resetarFerramenta();
    }, false);

    btnLinha.addEventListener('click', function () {
        habilitaFerramenta("linha");
        acaoCanvas(btnLinha, 2, 'linha');
    }, false);

    btnTriangulo.addEventListener('click', function () {
        habilitaFerramenta("triangulo");
        acaoCanvas(btnTriangulo, 3, 'triangulo');
    }, false);

    btnRetangulo.addEventListener('click', function () {
        resetarFerramenta();
        habilitaFerramenta("retangulo");
        btnRetangulo.className += ' btn-primary';
        canvas.addEventListener('click', func = function (e) {
            var p = criaPonto(e);
            arrayPontos.push(p);
            desenhaPonto(p, canvas);
            if (arrayPontos.length == 2) {
                var p3 = {
                        x: arrayPontos[0].x,
                        y: arrayPontos[1].y
                    },
                    p4 = {
                        x: arrayPontos[1].x,
                        y: arrayPontos[0].y
                    },
                    newArr = [arrayPontos[0], p3, arrayPontos[1], p4];
                criaObjeto(newArr, canvas, func, 'retangulo');
                arrayPontos = [];
                btnRetangulo.className = btnLinha.className.replace('btn-primary', '');
            }
        }, false);

    }, false);

    btnRotacao.addEventListener('click', function () {
        resetarFerramenta();
        habilitaFerramenta("rotacao");
        btnAtivo = btnRotacao;
        btnRotacao.className += ' btn-primary';
        /* Pega a area de selecao*/
        canvas.addEventListener('click', func = function (e) {
            arrayPontos.push(criaPonto(e));
            if (arrayPontos.length == 2) {
                desenhaAreaSelecao(arrayPontos[0], arrayPontos[1], canvas, func);

                /* Pega ponto de referência*/
                canvas.removeEventListener('click', func, false);

                canvas.addEventListener('click', func = function (e) {
                    if (!pontoSelecionado) {
                        desenhaPonto(criaPonto(e), canvas);
                        document.getElementById('infoangulo').style.display = 'block';
                        document.getElementById('infoangulo').style.position = 'absolute';
                        canvas.removeEventListener('click', func, false);
                    }
                }, false);
            }
        }, false);
    }, false);

    btnAplicarRotacao.addEventListener('click', aplicarRotacao, false);

    btnEscala.addEventListener('click', function () {
        resetarFerramenta();
        habilitaFerramenta("escala");
        btnAtivo = btnEscala;
        btnAtivo.className += ' btn-primary';
        arrayPontos = [];
        /* Pega a area de selecao*/
        canvas.addEventListener('click', func = function (e) {
            arrayPontos.push(criaPonto(e));
            if (arrayPontos.length == 2) {
                desenhaAreaSelecao(arrayPontos[0], arrayPontos[1], canvas, func);
                /* Pega ponto de referência e ponto destino */
                document.getElementById('infoescala').style.display = 'block';
                document.getElementById('infoescala').style.position = 'absolute';
            }
        }, false);
    }, false);

    btnAplicarEscala.addEventListener('click', aplicarEscala, false);

    btnTranslacao.addEventListener('click', function () {
        habilitaFerramenta("translacao");
        btnAtivo = btnTranslacao;
        btnTranslacao.className += ' btn-primary';
        canvas.addEventListener('click', func = function (e) {
            arrayPontos.push(criaPonto(e));
            if (arrayPontos.length == 2) {
                translacao(arrayPontos[0], arrayPontos[1], canvas, func);
                arrayPontos = [];
            }
        }, false);
    }, false);

    btnZoom.addEventListener('click', function () {
        zoomExtend(canvas);
    }, false);
}

function acaoCanvas(botao, qntd, tipo) {
    resetarFerramenta();
    botao.className += ' btn-primary';

    console.log(arrayPontos.length,qntd);
    canvas.addEventListener('click', func = function (e) {
        console.log(arrayPontos.length,qntd);
        var p = criaPonto(e);
        arrayPontos.push(p);
        desenhaPonto(p,canvas);
        console.log(arrayPontos.length,qntd);
        if (arrayPontos.length == qntd) {
            criaObjeto(arrayPontos, canvas, func, tipo);
            arrayPontos = [];
            botao.className = botao.className.replace('btn-primary', '');
        }
    }, false);
    console.log(arrayPontos.length,qntd);
}

function resetarFerramenta() {
    canvas.removeEventListener('click', func, false);
    listaObjetosSelecionados = [];
    pontoSelecionado = null;
    arrayPontos = [];
    botoes.forEach(function(botao){
        botao.className = botao.className.replace('btn-primary', '');
    });
}

function criaPonto(e) {
    return {
        x: e.layerX,
        y: e.layerY
    };
}

function montarMatrizRotacao(angulo) {
    return [
        [Math.cos(angulo), -Math.sin(angulo), 0],
        [Math.sin(angulo), Math.cos(angulo), 0],
        [0, 0, 1]];
}

function montarMatrizTranslacao(x, y) {
    return [[1, 0, x],
        [0, 1, y],
        [0, 0, 1]];
}

function aplicarRotacao() {
    //receber aqui o angulo da rotação
    var value = document.getElementById("entry").value * -1;

    var p = pontoSelecionado,
        angulo = value * (Math.PI / 180),
        matrizRotacao = montarMatrizRotacao(angulo),
        dx = 0 - p.x,
        dy = 0 - p.y,
        mtzTrlOrigem = montarMatrizTranslacao(dx, dy),
        mtzTrlDestino = montarMatrizTranslacao(p.x, p.y);

    listaObjetosSelecionados.forEach(function (objeto) {
        var objAux = calcula(objeto, mtzTrlOrigem);

        objAux = calcula(objAux, matrizRotacao);

        objAux = calcula(objAux, mtzTrlDestino);

        listaObjetos.push(objAux);

        listaObjetos = listaObjetos.filter(function (valor) {
            return valor.id != objeto.id;
        });
    });

    limpaCanvas();
    desenhaListaDeObjetos();
    document.getElementById('infoangulo').style.display = 'none';
    desabilitaFerramenta(canvas, func);
    resetarFerramenta();
}

/*Função para habilitar a ferramenta*/
function habilitaFerramenta(tool) {
    if (tool == "linha" || tool == "triangulo" || tool == "retangulo") {
        document.body.style.cursor = "pointer";
    }else if(tool == "translacao" || tool == "rotacao" || tool == "escala"){
        document.body.style.cursor = "crosshair";

    }
}

/*Comando para sair da ferramenta*/
document.onkeypress = function (evt) {
    if (evt.key == "s") {
        desabilitaFerramenta();
    }
};

/*Função para desabilitar a ferramenta*/
function desabilitaFerramenta(canvas, func) {
    canvas.removeEventListener('click', func, false);
    document.body.style.cursor = "auto";
}

/*Função utilizada para resetar o Canvas*/
function limpaCanvas(func) {
    var altera_canvas = document.getElementById("canvas");
    altera_canvas.width = altera_canvas.width;
    canvas.removeEventListener('click', func, false);
}

function resetaCanvas() {
    var altera_canvas = document.getElementById("canvas");
    altera_canvas.width = altera_canvas.width;
    canvas.removeEventListener('click', func, false);
    listaObjetos = [];
}

function criaObjeto(pontos, canvas, func, tipo) {
    var obj = {
        id: idObjetos++,
        tipo: tipo,
        matriz: [[], [], []]
    };
    pontos.forEach(function (data, index) {
        obj['ponto' + (index + 1)] = data;
        obj.matriz[0].push(data.x);
        obj.matriz[1].push(data.y);
        obj.matriz[2].push(1);
    });
    desenhaMatriz(obj.matriz, canvas);
    listaObjetos.push(obj);
    desabilitaFerramenta(canvas, func);
}

function desenhaMatriz(matriz, canvas) {
    var last = matriz[0].length - 1,
        contexto = canvas.getContext('2d');
    contexto.moveTo(matriz[0][last], matriz[1][last]);
    matriz[0].forEach(function (data, index) {
        var x = matriz[0][index],
            y = matriz[1][index];
        contexto.lineTo(x, y);
        contexto.moveTo(x, y);
    });
    contexto.stroke();
}

function rotacao(p1R, p2R, canvas, func) {
    var cliquePontos = [];
    var rect = canvas.getBoundingClientRect();

    desenhaAreaSelecao(p1R, p2R, canvas, func);

    habilitaFerramenta("rotacao");

    /* Pega ponto de referência e ponto destino */
    canvas.addEventListener('click', func = function (e) {
        if (!cliquePontos.length) {
            ponto = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            cliquePontos.push(ponto);
            desenhaPonto(ponto, canvas);
        }
    }, false);
}

var pontoSelecionado;
function desenhaPonto(p, canvas) {
    pontoSelecionado = p;
    var contexto = canvas.getContext('2d');
    contexto.fillStyle = '#FF0000';
    contexto.fillRect(p.x - 2, p.y - 2, 4, 4);
    contexto.stroke();
}

function translacao(p1A, p2A, canvas, func) {
    var cliquePontos = [];
    var rect = canvas.getBoundingClientRect();

    desenhaAreaSelecao(p1A, p2A, canvas, func);

    habilitaFerramenta("translacao");

    /* Pega ponto de referência e ponto destino */
    canvas.addEventListener('click', func = function (e) {
        ponto = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        desenhaPonto(ponto, canvas);
        cliquePontos.push(ponto);

        if (cliquePontos.length == 2) {
            var dx = cliquePontos[1].x - cliquePontos[0].x;
            var dy = cliquePontos[1].y - cliquePontos[0].y;

            var matrizTranslacao = [[1, 0, dx],
                [0, 1, dy],
                [0, 0, 1]];

            listaObjetosSelecionados.forEach(function (objeto) {
                listaObjetos.push(calcula(objeto, matrizTranslacao));

                listaObjetos = listaObjetos.filter(function (valor) {
                    return valor.id != objeto.id;
                });
            });

            limpaCanvas();
            desenhaListaDeObjetos();

            listaObjetosSelecionados = [];
            cliquePontos = [];

            desabilitaFerramenta(canvas, func);
            resetarFerramenta();
        }
    }, false);
}

/*Desenha no canvas todos os objetos da lista de objetos atual*/
function desenhaListaDeObjetos() {
    listaObjetos.forEach(function (obj) {
        desenhaMatriz(obj.matriz, canvas);
    });
}

/*Desenha área de seleção*/
function desenhaAreaSelecao(ponto1, ponto2, canvas, func) {
    var contexto = canvas.getContext('2d');

    contexto.fillStyle = "rgba(0,0,0,.1)";
    contexto.fillRect(
        ponto1.x,
        ponto1.y,
        ponto2.x - ponto1.x,
        ponto2.y - ponto1.y
    );

    var ponto3 = {
        x: ponto1.x,
        y: ponto2.y
    };

    var ponto4 = {
        x: ponto2.x,
        y: ponto1.y
    };

    areaSelecao = {
        ponto1: ponto1,
        ponto2: ponto2,
        ponto3: ponto3,
        ponto4: ponto4
    };

    selecionaObjetos();
}

/*Seleciona objetos que foram SELECIONADOS COMPLETAMENTE*/
function selecionaObjetos() {
    listaObjetos.filter(function (objeto) {
        return objeto.matriz[0].filter(function (data, index) {
                return !contidoSelecaoNovo(objeto.matriz[0][index], objeto.matriz[1][index]);
            }).length == 0;
    }).forEach(function (objeto) {
        listaObjetosSelecionados.push(objeto);
    });
}

function contidoSelecaoNovo(x, y) {
    return (x >= areaSelecao.ponto1.x) && (x <= areaSelecao.ponto2.x) &&
        (y >= areaSelecao.ponto1.y) && (y <= areaSelecao.ponto2.y);
}

/*Efetua o cálculo da translção e retorna o objeto correto*/
function calcula(Obj, mT) {
    c = [];
    a = Obj.matriz;

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
    return {
        id: idObjetos++,
        matriz: c
    };
}

function montarMatrizEscala(x, y) {
    return [[x, 0, 0],
        [0, y, 0],
        [0, 0, 1]];
}

function aplicarEscala() {
    var valueX = document.getElementById("valueX").value || 0,
        valueY = document.getElementById("valueY").value || 0;

    var p = pontoSelecionado,
        matrizEscala = montarMatrizEscala(valueX, valueY);

    listaObjetosSelecionados.forEach(function (objeto) {
        var x = objeto.matriz[0][0],
            y = objeto.matriz[1][0],
            dx = 0 - x,
            dy = 0 - y,
            mtzTrlOrigem = montarMatrizTranslacao(dx, dy),
            mtzTrlDestino = montarMatrizTranslacao(x, y);

        var objAux = calcula(objeto, mtzTrlOrigem);

        objAux = calcula(objAux, matrizEscala);

        objAux = calcula(objAux, mtzTrlDestino);

        listaObjetos.push(objAux);

        listaObjetos = listaObjetos.filter(function (valor) {
            return valor.id != objeto.id;
        });
    });

    limpaCanvas();
    desenhaListaDeObjetos();

    listaObjetosSelecionados = [];
    document.getElementById('infoescala').style.display = 'none';
    btnAtivo.className = btnAtivo.className.replace('btn-primary', '');
}

function zoomExtend(canvas){

    contexto = canvas.getContext('2d');

    var arrayX = [];
    var arrayY = [];

    var xm = 999999999, ym = 999999999, xM = 0, yM = 0;
    listaObjetos.forEach(function (objeto) {
        Object.keys(objeto).forEach(function (atributo) {
            if(atributo != "id" && atributo != "tipo" && atributo != "matriz"){
              arrayX.push(parseInt(objeto[atributo].x));
              arrayY.push(parseInt(objeto[atributo].y));
            }
        })
    });

    arrayX = arrayX.sort(function (a, b) {
        return a - b;
    });

    arrayY = arrayY.sort(function (a, b) {
        return a - b;
    });

    janela = {
        p1 : null,
        p2 : null,
        p3 : null,
        p4 : null
    };

    janela.p1 = {
        x : arrayX[0] - (0.05 * canvas.width),
        y : arrayY[0] - (0.05 * canvas.height)
    };
    janela.p2 = {
        x : arrayX[arrayX.length - 1] + (0.05 * canvas.width),
        y : arrayY[arrayY.length - 1] + (0.05 * canvas.height)
    };
    janela.p3 = {
        x : janela.p1.x,
        y : janela.p2.y
    };
    janela.p4 = {
        x : janela.p2.x,
        y : janela.p1.y
    };

    origem = {
        x : 0,
        y : 0
    };

    contexto.moveTo(janela.p1.x, janela.p1.y)
    contexto.lineTo(janela.p3.x, janela.p3.y)

    contexto.moveTo(janela.p3.x, janela.p3.y)
    contexto.lineTo(janela.p2.x, janela.p2.y)

    contexto.moveTo(janela.p2.x, janela.p2.y)
    contexto.lineTo(janela.p4.x, janela.p4.y)

    contexto.moveTo(janela.p4.x, janela.p4.y)
    contexto.lineTo(janela.p1.x, janela.p1.y)

    contexto.stroke();

    aplicaZoomExtend(janela.p1, origem, canvas);
}

function aplicaZoomExtend() {
    /*informações tranlação -x, -y*/
    var dx = 0 - janela.p1.x;
    var dy = 0 - janela.p1.y;
    var matrizTranslacao = [
        [1, 0, dx],
        [0, 1, dy],
        [0, 0, 1]
    ];

    /*informações mudança de escala*/
    var sx = (canvas.width - 0) / (janela.p2.x - janela.p1.x);
    var sy = (canvas.height - 0) / (janela.p2.y - janela.p1.y);
    var matrizMudancaEscala = [
        [sx, 0, 0],
        [0, sy, 0],
        [0, 0, 1]
    ];

    /*informações tranlação +x, +y*/
    var dx = 0;
    var dy = 0;
    var matrizTranslacaoVolta = [
        [1, 0, dx],
        [0, 1, dy],
        [0, 0, 1]
    ];

    newListaObjetosTransladados = [];
    newListaObjetosEscala = [];
    newListaObjetos = [];

    listaObjetos.forEach(function (objeto) {
        newListaObjetosTransladados.push(calcula(objeto, matrizTranslacao));
    });

    resetaCanvas();

    newListaObjetosTransladados.forEach(function (objeto) {
        newListaObjetosEscala.push(calcula(objeto, matrizMudancaEscala));
    });

    newListaObjetosEscala.forEach(function (objeto) {
        newListaObjetos.push(calcula(objeto, matrizTranslacaoVolta));
    });

    listaObjetos = newListaObjetos;

    newListaObjetosTransladados = [];
    newListaObjetosEscala = [];
    newListaObjetos = [];

    desenhaListaDeObjetos();
}
