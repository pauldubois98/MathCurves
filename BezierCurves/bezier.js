var canvas = document.getElementById("bezier-canvas");
const WIDTH = canvas.clientWidth;
const HEIGHT = canvas.clientHeight;
var n = range_pts.value;
var t = 0;
var xs = [];
var ys = [];
var trace_xs = [];
var trace_ys = [];
var ctx = canvas.getContext("2d");

function set_pts(n) {
  t = 0;
  trace_xs = [];
  trace_ys = [];
  xs = [];
  ys = [];
  for (let i = 0; i < n; i++) {
    var x = (WIDTH * (i + 0.5)) / n;
    var y =
      HEIGHT * 0.05 + 0.45 * HEIGHT * Math.random() + (i % 2) * HEIGHT * 0.45;
    xs.push(x);
    ys.push(y);
  }
  draw_inter_pts(t);
}
set_pts(n);

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
  while (xs_copy.length > 0) {
    ctx.fillStyle = "black";
    for (let i = 0; i < xs_copy.length; i++) {
      const x = xs_copy[i];
      const y = ys_copy[i];
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 1;
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
    if (xs_copy.length == 1) {
      trace_xs.push(xs_copy[0]);
      trace_ys.push(ys_copy[0]);
    }
  }
  // trace
  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  ctx.moveTo(trace_xs[0], trace_ys[0]);
  for (let i = 1; i < trace_xs.length; i++) {
    const x = trace_xs[i];
    const y = trace_ys[i];
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function animate() {
  t += 0.0001 * animation_speed.value;
  if (t > 1) {
    t = 0;
    trace_xs = [];
    trace_ys = [];
  }
  draw_inter_pts(t);
}
function change_animate() {
  if (animate_checkbox.checked) {
    animation = setInterval(animate, 5);
  } else {
    clearInterval(animation);
  }
}
var animation = undefined;
change_animate();
