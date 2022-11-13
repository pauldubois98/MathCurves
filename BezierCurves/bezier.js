var canvas = document.getElementById("bezier-canvas");
const WIDTH = canvas.clientWidth;
const HEIGHT = canvas.clientHeight;
var n = range_pts.value;
var xs = [];
var ys = [];
var ctx = canvas.getContext("2d");

function draw_pts(n) {
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
draw_pts(n);

function fact(num) {
  var rval = 1;
  for (var i = 2; i <= num; i++) rval = rval * i;
  return rval;
}
function bin(n, k) {
  var num = 1;
  for (var i = k + 1; i <= n; i++) num = num * i;
  var den = 1;
  for (var i = 2; i <= n - k; i++) den = den * i;
  return num / den;
}
