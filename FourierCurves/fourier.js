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
  { r: 50, a: 1 },
  { r: 20, a: 2 },
];
var COEFFS_NEGATIVES = [
  { r: 40, a: 3 },
  { r: 10, a: 0 },
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
