var canvas = document.getElementById("bezier-canvas");
const WIDTH = canvas.clientWidth;
const HEIGHT = canvas.clientHeight;
var n = 4;
var ctx = canvas.getContext("2d");

function draw(n) {
  xs = [];
  ys = [];
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "grey";
  for (let i = 0; i < n; i++) {
    var x = (WIDTH * (i + 0.5)) / n;
    var y = (HEIGHT * (1 + (i % 2))) / 3;
    xs.push(x);
    ys.push(y);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}
