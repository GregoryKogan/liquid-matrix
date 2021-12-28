let matrix;


function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
    matrix = new Matrix(8, 29);
    // matrix = new Matrix(30, 430);
}

function draw(){
    background("#1d2021");
    matrix.update();
}
