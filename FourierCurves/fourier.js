var canvas = document.getElementById("fourier-canvas");
const WIDTH = canvas.clientWidth;
const HEIGHT = canvas.clientHeight;
var ctx = canvas.getContext("2d");
var mouse_down = false;
var mouse_point = undefined;
var PTS = [
  { x: 50, y: 100 },
  { x: 100, y: 50 },
  { x: 150, y: 100 },
  { x: 200, y: 50 },
  { x: 250, y: 100 },
];
var COEFFS_POSITIVES = [
  { r: (WIDTH ** 2 + HEIGHT ** 2) ** 0.5 / 2, a: +Math.PI / 4 },
  { r: 100, a: 1 },
  { r: 40, a: 2 },
];
var COEFFS_NEGATIVES = [
  { r: 0, a: 0 },
  { r: 80, a: 3 },
  { r: 20, a: 0 },
];
var T = 0;

function render() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "black";
  for (let i = 0; i < PTS.length; i++) {
    ctx.beginPath();
    ctx.arc(PTS[i].x, PTS[i].y, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    if (mouse_down && i == mouse_point) {
      ctx.strokeStyle = "grey";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(PTS[i].x, PTS[i].y, 6, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
    }
  }
}
render();

function get_mouse_pos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}
canvas.addEventListener("pointerdown", function (evt) {
  var mousePos = get_mouse_pos(canvas, evt);
  mouse_down = false;
  for (let i = 0; i < PTS.length; i++) {
    if ((PTS[i].x - mousePos.x) ** 2 + (PTS[i].y - mousePos.y) ** 2 < 100) {
      mouse_point = i;
      mouse_down = true;
    }
  }
  if (!mouse_down) {
    PTS.push(mousePos);
    mouse_down = true;
    mouse_point = PTS.length - 1;
  }
  render();
});

canvas.addEventListener("pointermove", function (evt) {
  if (mouse_down) {
    var mousePos = get_mouse_pos(canvas, evt);
    PTS[mouse_point] = mousePos;
    render();
  }
});

canvas.addEventListener("pointerup", function (evt) {
  mouse_down = false;
  prev_mousePos = undefined;
  render();
});

function plot(t) {
  var x = 0;
  var y = 0;
  ctx.strokeStyle = "grey";
  ctx.lineWidth = 2;
  ctx.moveTo(x, y);
  ctx.beginPath();
  for (let i = 0; i < COEFFS_POSITIVES.length; i++) {
    const coef_positive = COEFFS_POSITIVES[i];
    const coef_negative = COEFFS_NEGATIVES[i];
    x += coef_positive.r * Math.cos(i * t + coef_positive.a);
    y += coef_positive.r * Math.sin(i * t + coef_positive.a);
    ctx.lineTo(x, y);
    x += coef_negative.r * Math.cos(-i * t + coef_negative.a);
    y += coef_negative.r * Math.sin(-i * t + coef_negative.a);
    ctx.lineTo(x, y);
  }
}

function animate() {
  T += 0.02;
  if (T > 2 * Math.PI) {
    T -= 2 * Math.PI;
  }
  render();
  plot(T);
  ctx.stroke();
}

setInterval(animate, 20);
