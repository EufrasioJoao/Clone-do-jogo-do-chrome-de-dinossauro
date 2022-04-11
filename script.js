/*
======================================
    primeiro passos/aula1/video1:

    -criar as variaveis essenciais:
    var canvas; //para desenhar as coisas...
    var ctx, ALTURA, LARGURA, frames = 0; //ctx = contexto;

    -criar funcoes principal e secundaria:
    main, atualiza, roda, desenha, clique;

    -canvas cor de fundo;
=======================================
//////////////////////////////////////

 */



//variaveis do nosso jogo, tanto faz

var canvas; //para desenhar as coisas...
var ctx, ALTURA, LARGURA, frames = 0, maxPulos = 3, velocidade = 8; //ctx = contexto
var estadoAtual;
var record, img;

var estados = {
    jogar : 0,
    jogando : 1,
    perdeu: 2
}

//var de chao
var chao = {
    y: 550,
    altura: 50,
    cor: "#ffdf70",

    desenha: function(){ //metodo pra desnhar chao
        ctx.fillStyle = this.cor;
        ctx.fillRect(0, this.y, LARGURA, this.altura )
    }
};


//var de bloco
var bloco = {
     x: 50,
     y: 0,
     altura: 50,
     largura: 50,
     cor: "#ff4e4e",
     score: 0,

     //metodos do bloco
     desenha: function(){
         ctx.fillStyle = this.cor;
         ctx.fillRect(this.x, this.y, this.altura, this.largura);
     },

     gravidade: 2,
     velocidade: 0,
     forcaDoPulo: 25,  
     qntPulos : 0,

     //metodo atualiza
     atualiza: function(){
        this.velocidade += this.gravidade; 
        this.y += this.velocidade; 

        if(this.y > chao.y - this.altura && estadoAtual != estados.perdeu){
            this.y = chao.y - this.altura;
            this.qntPulos = 0;
            this.velocidade = 0;
        }
    },
    reset: function(){
        this.y = 0;
        this.velocidade = 0;
        obstaculos.limpa();

        if(this.score > record){
            localStorage.setItem("record", this.score);
            record = this.score;
        }

        this.score = 0;
    },
    pula: function(){
        if(this.qntPulos < maxPulos){
            this.velocidade = -this.forcaDoPulo;
            this.qntPulos++; 
        }
    }

   
}
obstaculos = {
    _obs: [],
    cores: ["#ffbc1c", "#ff1c1c", "#ff85e1", "#52a7ff", "#78ff5d"],
    tempoInsere: 0,


    insere : function() {
        this._obs.push({
            x: LARGURA,
           // largura : 30 + Math.floor(21 * Math.random()),
           largura : 50, 
           altura : 30 + Math.floor(Math.random() * 120),
            cor : this.cores[Math.floor(5 * Math.random())]
        });

        this.tempoInsere = 30 + Math.floor(Math.random() * 30);
    },

    atualiza : function(){
        if(this.tempoInsere == 0){
            this.insere();
        }else{
            this.tempoInsere--;
        }
        for(var i = 0, tam = this._obs.length; i<tam; i++ ){
            var obs = this._obs[i];

            obs.x -= velocidade;
            if(bloco.x < obs.x + obs.largura && bloco.x + bloco.largura >= obs.x && bloco.y + bloco.altura >= chao.y - obs.altura){
                estadoAtual = estados.perdeu;
            }

            else if(obs.x == 0){
                bloco.score++;
            }

            else if (obs.x <= -obs.largura) {
                this._obs.splice(i,1);
                tam--;
                i--;
            }
        }
    },

    limpa: function(){
        this._obs = []
    },

    desenha : function(){
        for(var i = 0, tam = this._obs.length; i<tam; i++){
            var obs = this._obs[i];
            ctx.fillStyle = obs.cor;
            ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura);
        }
    }

};


//funcao principal
function main() {
    ALTURA = window.innerHeight;
    LARGURA = window.innerWidth;

    if(LARGURA >= 500){

        LARGURA = 600;
        ALTURA = 600;
    }

    canvas = document.createElement("canvas"); //criando um elemento do tipo canvas
    canvas.width = LARGURA;
    canvas.height = ALTURA;
    canvas.style.border = "1px solid #000";
    //canvas.style.background = "url('platformSmallTall.png')"

    //definindo o contexto
    ctx = canvas.getContext("2d");

    //adicionando canvas no html
    document.body.appendChild(canvas);

    document.addEventListener("mousedown", clique)

    estadoAtual = estados.jogar;

    record = localStorage.getItem("record");
    if(record == null){
        record = 0
    }
    img = new Image();
    img.src = "platformSmallTall.png";
    roda();
    
}

//ao clicar no canvas 
function clique(evento) {
    console.log("clicou") 
    if(estadoAtual == estados.jogando && bloco.y <= 2*ALTURA){
        bloco.pula();
    }else if(estadoAtual == estados.jogar){
        estadoAtual = estados.jogando
    }else if(estadoAtual == estados.perdeu && bloco.y >= 2 * ALTURA){
        estadoAtual = estados.jogar
        bloco.reset();
    }
}


//desenhar as coisas depois de atualizar
function roda() {
    actualiza();
    desenha();

    //atualiza em um loop nfinito
    window.requestAnimationFrame(roda); 
}

function desenha() {
    ctx.fillStyle = "#50beff"; //atribuindo a canvas um background de tom azul
    ctx.fillRect(0, 0, LARGURA, ALTURA);
    //bg.desenha(0,0)

    ctx.fillStyle = "#fff";
    ctx.font = "50px Arial";
    ctx.fillText(bloco.score, 30, 68);

    if(estadoAtual == estados.jogar){
        ctx.fillStyle = "green";
        ctx.fillRect(LARGURA / 2-50, ALTURA /2-50, 100, 100);
         

    }else if(estadoAtual == estados.perdeu){
        ctx.fillStyle = "red";
        ctx.fillRect(LARGURA / 2-50, ALTURA /2-50, 100, 100);

        ctx.save();
        ctx.translate(LARGURA/2, ALTURA /2)

        ctx.fillStyle = "#fff"

        if(bloco.score > record){
            ctx.fillText("Novo record ", -150, -65)
        }else if(bloco.score < record){
            ctx.fillText("Record " + record, -99, -65)
        }else if(record >=10 && record < 100  ){
            ctx.fillText("Record " + record, -112, -65)
        }else{
            ctx.fillText("Record " + record, -125, -65)
        }




        if(bloco.score < 10)
            ctx.fillText(bloco.score, -13 , 19)

        else if(bloco.score >=10 && bloco.score < 100)
            ctx.fillText(bloco.score, -26 , 19)

        else{
            ctx.fillText(bloco.score, -39, 19)
        }
        ctx.restore()

    }else if(estadoAtual == estados.jogando){
        obstaculos.desenha();
    }
    

    //chamando metodo desenha do objecto chao
    chao.desenha();
    bloco.desenha();
}


//atualizar os framaes, obstaculos do jogo, etc.
function actualiza() {
    frames++;
    bloco.atualiza(); 
    if(estadoAtual == estados.jogando){
        obstaculos.atualiza();
    }
}


