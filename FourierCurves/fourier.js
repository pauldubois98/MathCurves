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

function render() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "black";
  for (let i = 1; i < PTS.length; i++) {
    ctx.beginPath();
    ctx.arc(PTS[i].x, PTS[i].y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}
render();
