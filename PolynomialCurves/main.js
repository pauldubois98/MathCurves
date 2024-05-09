var xs = [];
var ys = [];
var ctx = canvas.getContext("2d");
var POINTER_DOWN = false;

var coefs = [
    tf.variable(tf.scalar(Math.random() * 2 - 1)),
    tf.variable(tf.scalar(Math.random() * 2 - 1)),
    tf.variable(tf.scalar(Math.random() * 2 - 1)),
];

function map(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

canvas.onpointerdown = function (e) {
  POINTER_DOWN = true;
  var x = map(e.x - canvas.offsetLeft, 0, canvas.width, -1, 1);
  var y = map(e.y - canvas.offsetTop, 0, canvas.height, 1, -1);
  xs.push(x);
  ys.push(y);
  draw();
};
canvas.onpointermove = function (e) {
  if (POINTER_DOWN) {
    var x = map(e.x - canvas.offsetLeft, 0, canvas.width, -1, 1);
    var y = map(e.y - canvas.offsetTop, 0, canvas.height, 1, -1);
    xs[xs.length - 1] = x;
    ys[ys.length - 1] = y;
    draw();
  }
};
canvas.onpointerup = function (e) {
  POINTER_DOWN = false;
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < xs.length; i++) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    var x = map(xs[i], -1, 1, 0, canvas.width);
    var y = map(ys[i], 1, -1, 0, canvas.height);
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
  ctx.beginPath();
  ctx.strokeStyle = "red";
  for (var x = -1; x < 1; x += 0.01) {
    var y = 0;
    for (var i = 0; i < coefs.length; i++) {
      y += coefs[i].dataSync()[0] * Math.pow(x, i);
    }
    ctx.lineTo(map(x, -1, 1, 0, canvas.width), map(y, 1, -1, 0, canvas.height));
  }
  ctx.stroke();
  ctx.closePath();
}

draw();