var canvas = document.getElementById("bezier-canvas");
const WIDTH = canvas.clientWidth;
const HEIGHT = canvas.clientHeight;
var n = range_pts.value;
var t = 0;
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

function intermediates(l, t) {
  new_l = [];
  for (let i = 1; i < l.length; i++) {
    const p1 = l[i - 1];
    const p2 = l[i];
    new_l.push((1 - t) * p1 + p2 * t);
  }
  return new_l;
}

function draw_inter_pts(t) {
  var xs_copy = xs;
  var ys_copy = ys;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "black";
  while (xs_copy.length > 0) {
    for (let i = 0; i < xs_copy.length; i++) {
      const x = xs_copy[i];
      const y = ys_copy[i];
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(xs_copy[0], ys_copy[0]);
    for (let i = 1; i < xs_copy.length; i++) {
      const x = xs_copy[i];
      const y = ys_copy[i];
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    xs_copy = intermediates(xs_copy, t);
    ys_copy = intermediates(ys_copy, t);
  }
}
