var xs = [];
var ys = [];
var ctx = canvas.getContext("2d");
var POINTER_DOWN = false;

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
    ctx.arc(x,y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}
