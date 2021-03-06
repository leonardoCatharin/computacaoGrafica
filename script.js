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
var comentHelp;

/*Chamada da função Principal quando a página é carregada*/
window.onload = function () {
    main();
};

/*Função Principal
* Contém os Listener para todos os botões da interface com o usuário*/
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
    comentHelp = document.getElementById('coments');

    btnClear.addEventListener('click', function () {
        comentHelp.innerText = "Selecione uma ferramenta!";
        resetaCanvas();
        resetarFerramenta();
    }, false);

    btnLinha.addEventListener('click', function () {
        comentHelp.innerText = "Clique em dois pontos quaisquer no canvas para desenhar a linha!";
        habilitaFerramenta("linha");
        acaoCanvas(btnLinha, 2, 'linha');
    }, false);

    btnTriangulo.addEventListener('click', function () {
        comentHelp.innerText = "Clique em três pontos quaisquer no canvas para desenhar o triângulo!";
        habilitaFerramenta("triangulo");
        acaoCanvas(btnTriangulo, 3, 'triangulo');
    }, false);

    btnRetangulo.addEventListener('click', function () {
        comentHelp.innerText = "Clique em dois pontos quaisquer no canvas para desenhar o retângulo! \n\n Esses dois pontos formarão a diagonal do retângulo.";
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
        comentHelp.innerHTML = "Dê dois cliques formando a diagonal da área de seleção! <br> <br> " +
            "<font color='red'>IMPORTANTE: </font> A diagonal da área de seleção deve ser sempre do CANTO ESQUERDO SUPERIOR para o CANTO DIREITO INFERIOR. <br> <br>" +
            "<font color='red'>IMPORTANTE: </font> A rotação só será aplicada nos objetos que estiverem COMPLETAMENTE dentro da área de seleção.";
        resetarFerramenta();
        habilitaFerramenta("rotacao");
        btnAtivo = btnRotacao;
        btnRotacao.className += ' btn-primary';
        /* Pega a area de selecao*/
        canvas.addEventListener('click', func = function (e) {
            arrayPontos.push(criaPonto(e));
            if (arrayPontos.length == 2) {
                comentHelp.innerText = "1.  Selecione o ponto de referência para a rotação! \n\n " +
                    "2.  Informe o ângulo de rotação seguindo a regra da mão direita.";
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
        comentHelp.innerHTML = "Dê dois cliques formando a diagonal da área de seleção! <br> <br> " +
            "<font color='red'>IMPORTANTE: </font> A diagonal da área de seleção deve ser sempre do CANTO ESQUERDO SUPERIOR para o CANTO DIREITO INFERIOR. <br> <br>" +
            "<font color='red'>IMPORTANTE: </font> A mudança de escala só será aplicada nos objetos que estiverem COMPLETAMENTE dentro da área de seleção.";
        resetarFerramenta();
        habilitaFerramenta("escala");
        btnAtivo = btnEscala;
        btnAtivo.className += ' btn-primary';
        arrayPontos = [];
        /* Pega a area de selecao*/
        canvas.addEventListener('click', func = function (e) {
            arrayPontos.push(criaPonto(e));
            if (arrayPontos.length == 2) {
                comentHelp.innerText = "Informe os valores de mudança de escala \n\n " +
                    "IMPORTANTE: Sx = 1, Sy = 1 indicam que o objeto manterá as mesmas medidas";
                desenhaAreaSelecao(arrayPontos[0], arrayPontos[1], canvas, func);
                /* Pega ponto de referência e ponto destino */
                document.getElementById('infoescala').style.display = 'block';
                document.getElementById('infoescala').style.position = 'absolute';
            }
        }, false);
    }, false);

    btnAplicarEscala.addEventListener('click', aplicarEscala, false);

    btnTranslacao.addEventListener('click', function () {
        comentHelp.innerHTML = "Dê dois cliques formando a diagonal da área de seleção! <br> <br> " +
            "<font color='red'>IMPORTANTE: </font> A diagonal da área de seleção deve ser sempre do CANTO ESQUERDO SUPERIOR para o CANTO DIREITO INFERIOR. <br> <br>" +
            "<font color='red'>IMPORTANTE: </font> A translação só será aplicada nos objetos que estiverem COMPLETAMENTE dentro da área de seleção.";
        habilitaFerramenta("translacao");
        btnAtivo = btnTranslacao;
        btnTranslacao.className += ' btn-primary';
        canvas.addEventListener('click', func = function (e) {
            arrayPontos.push(criaPonto(e));
            if (arrayPontos.length == 2) {
                comentHelp.innerText = "Selecione o ponto de referência para a translação! \n\n " +
                    "Em seguida selecione o ponto de destino para transladar os objetos.";
                translacao(arrayPontos[0], arrayPontos[1], canvas, func);
                arrayPontos = [];
            }
        }, false);
    }, false);

    btnZoom.addEventListener('click', function () {
        zoomExtend(canvas);
    }, false);
}

/*Gerencia o fluxo das ações no canvas. Identifica e 'chama' a ferramenta escolhida pelo usuário*/
function acaoCanvas(botao, qntd, tipo) {
    resetarFerramenta();
    botao.className += ' btn-primary';
    canvas.addEventListener('click', func = function (e) {
        var p = criaPonto(e);
        arrayPontos.push(p);
        desenhaPonto(p, canvas);
        if (arrayPontos.length == qntd) {
            criaObjeto(arrayPontos, canvas, func, tipo);
            arrayPontos = [];
            botao.className = botao.className.replace('btn-primary', '');
        }
    }, false);
}

/*Reseta a ferramenta para outras poderem ser utilidas e o fluxo não ficar na ferramenta em questão*/
function resetarFerramenta() {
    canvas.removeEventListener('click', func, false);
    listaObjetosSelecionados = [];
    pontoSelecionado = null;
    arrayPontos = [];
    botoes.forEach(function (botao) {
        botao.className = botao.className.replace('btn-primary', '');
    });
}

/*Construtor de pontos*/
function criaPonto(e) {
    return {
        x: e.layerX,
        y: e.layerY
    };
}

/*Construtor da matriz de rotação*/
function montarMatrizRotacao(angulo) {
    return [
        [Math.cos(angulo), -Math.sin(angulo), 0],
        [Math.sin(angulo), Math.cos(angulo), 0],
        [0, 0, 1]];
}

/*Construtor da matriz de translação*/
function montarMatrizTranslacao(x, y) {
    return [[1, 0, x],
        [0, 1, y],
        [0, 0, 1]];
}

/*Função utilizada para a aplicação da rotação*/
function aplicarRotacao() {
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
    } else if (tool == "translacao" || tool == "rotacao" || tool == "escala") {
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
    comentHelp.innerText = "Selecione uma ferramenta!";
}

/*Função utilizada para resetar o Canvas*/
function limpaCanvas(func) {
    var altera_canvas = document.getElementById("canvas");
    altera_canvas.width = altera_canvas.width;
    canvas.removeEventListener('click', func, false);
}

/*Reseta canvas + listaObjetos*/
function resetaCanvas() {
    var altera_canvas = document.getElementById("canvas");
    altera_canvas.width = altera_canvas.width;
    canvas.removeEventListener('click', func, false);
    listaObjetos = [];
}

/*Cria objeto (id + matriz) baseado nos pontos informados*/
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

/*Desenha matriz de pontos no canvas*/
function desenhaMatriz(matriz) {
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

/*Aplica rotação partindo um ponto de referência + ângulo informado*/
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

/*Desenha ponto vermelho para demarcação de referência*/
var pontoSelecionado;
function desenhaPonto(p, canvas) {
    pontoSelecionado = p;
    var contexto = canvas.getContext('2d');
    contexto.fillStyle = '#FF0000';
    contexto.fillRect(p.x - 2, p.y - 2, 4, 4);
    contexto.stroke();
}

/*Configura e aplica a translação*/
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
        desenhaMatriz(obj.matriz);
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

/*Verifica se ponto está contido na seleção*/
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

/*Construtor da matriz de mudança de escala*/
function montarMatrizEscala(x, y) {
    return [[x, 0, 0],
        [0, y, 0],
        [0, 0, 1]];
}

/*Função responsável por aplicar a escala*/
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
    desabilitaFerramenta(canvas, func);
    resetarFerramenta();
}

/*Encontra os ponto mínimo e máximo da janela
* Chama a função de aplicação do zoom*/
function zoomExtend() {
    contexto = canvas.getContext('2d');

    var arrayX = [];
    var arrayY = [];

    var xm = 999999999, ym = 999999999, xM = 0, yM = 0;
    listaObjetos.forEach(function (objeto) {
        arrayX = arrayX.concat(objeto.matriz[0]);
        arrayY = arrayY.concat(objeto.matriz[1]);
    });

    arrayX = arrayX.sort(function (a, b) {
        return a - b;
    });

    arrayY = arrayY.sort(function (a, b) {
        return a - b;
    });

    janela = {
        p1: null,
        p2: null,
        p3: null,
        p4: null
    };

    janela.p1 = {
        x: arrayX[0] - (0.1 * canvas.width),
        y: arrayY[0] - (0.1 * canvas.height)
    };
    janela.p2 = {
        x: arrayX[arrayX.length - 1] + (0.05 * canvas.width),
        y: arrayY[arrayY.length - 1] + (0.05 * canvas.height)
    };
    janela.p3 = {
        x: janela.p1.x,
        y: janela.p2.y
    };
    janela.p4 = {
        x: janela.p2.x,
        y: janela.p1.y
    };

    origem = {
        x: 0,
        y: 0
    };

    aplicaZoomExtend(janela.p1, origem, canvas);
}

/*Função utilizada para aplicar a translação e mudança de escala com razão de aspecto para o Canvas (ViewPort)*/
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
    var aspectoJanela = (janela.p2.x - janela.p1.x) / (janela.p2.y - janela.p1.y),
        aspectoCanvas = canvas.width / canvas.height;

    var uMax = canvas.width,
        vMax = canvas.height;

    if (aspectoJanela > aspectoCanvas) {
        vMax = canvas.width / aspectoJanela;
    } else {
        uMax = canvas.height * aspectoJanela;
    }

    var sx = (uMax - 0) / (janela.p2.x - janela.p1.x);
    var sy = (vMax - 0) / (janela.p2.y - janela.p1.y);
    var matrizMudancaEscala = [
        [sx, 0, 0],
        [0, sy, 0],
        [0, 0, 1]
    ];

    var result = listaObjetos.map(function (objeto) {
        return calcula(objeto, matrizTranslacao);
    }).map(function (objeto) {
        return calcula(objeto, matrizMudancaEscala);
    });
    resetaCanvas();
    listaObjetos = result;
    desenhaListaDeObjetos();
    resetarFerramenta();
    desabilitaFerramenta(canvas, func);
}