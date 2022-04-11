function sprite(x, y, largura, altura) {
    this.y = y;
    this.x = x;
    this.largura = largura;
    this.altura = altura;

    this.desenha = function(xCanvas, yCanvas){
        ctx.drawImage(img, this.x, this.y, this.largura, this.altura, xCanvas, yCanvas, this.largura, this.altura);
    }
}

//var bg = new sprite(0,0, 600, 600);