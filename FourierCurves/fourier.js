var canvas = document.getElementById("fourier-canvas");
const WIDTH = canvas.clientWidth;
const HEIGHT = canvas.clientHeight;
var ctx = canvas.getContext("2d");
var mouse_down = false;
var mouse_point = undefined;
var PTS = [
  { x: 100, y: 200 },
  { x: 150, y: 150 },
  { x: 200, y: 100 },
  { x: 250, y: 150 },
  { x: 300, y: 200 },
  { x: 350, y: 150 },
  { x: 400, y: 100 },
  { x: 450, y: 150 },
  { x: 500, y: 200 },
  { x: 400, y: 300 },
  { x: 300, y: 400 },
  { x: 200, y: 300 },
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
var TRACE = [];

// calculation functions //
function cartesian_to_polar(x, y) {
  var r = (x ** 2 + y ** 2) ** 0.5;
  var a = Math.atan2(y, x);
  return { r: r, a: a };
}
function polar_to_cartesian(r, a) {
  var x = r * Math.cos(a);
  var y = r * Math.sin(a);
  return { x: x, y: y };
}
function calculate_fourier() {
  COEFFS_POSITIVES = [];
  COEFFS_NEGATIVES = [];
  var x = 0;
  var y = 0;
  for (let i = 0; i < PTS.length; i++) {
    const point = PTS[i];
    x += point.x;
    y += point.y;
  }
  x /= PTS.length;
  y /= PTS.length;
  COEFFS_POSITIVES.push(cartesian_to_polar(x, y));
  COEFFS_NEGATIVES.push({ r: 0, a: 0 });
  for (
    let i = 1;
    (i < Number(number_fourier_min.value)) & (i < PTS.length);
    i++
  ) {
    var x = 0;
    var y = 0;
    for (let j = 0; j < PTS.length; j++) {
      const point = PTS[j];
      var point_pol = cartesian_to_polar(point.x, point.y);
      point_pol.a += i * (j / PTS.length) * 2 * Math.PI;
      var point_cart = polar_to_cartesian(point_pol.r, point_pol.a);
      x += point_cart.x;
      y += point_cart.y;
    }
    x /= PTS.length;
    y /= PTS.length;
    COEFFS_NEGATIVES.push(cartesian_to_polar(x, y));
  }
  for (
    let i = 1;
    (i < Number(number_fourier_max.value)) &
    (i - 1 + Number(number_fourier_min.value) < PTS.length);
    i++
  ) {
    var x = 0;
    var y = 0;
    for (let j = 0; j < PTS.length; j++) {
      const point = PTS[j];
      var point_pol = cartesian_to_polar(point.x, point.y);
      point_pol.a -= i * (j / PTS.length) * 2 * Math.PI;
      var point_cart = polar_to_cartesian(point_pol.r, point_pol.a);
      x += point_cart.x;
      y += point_cart.y;
    }
    x /= PTS.length;
    y /= PTS.length;
    COEFFS_POSITIVES.push(cartesian_to_polar(x, y));
  }
  TRACE = [];
}
calculate_fourier();

// event listeners //
function get_mouse_pos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}
canvas.addEventListener("pointerdown", function (evt) {
  var mousePos = get_mouse_pos(canvas, evt);
  if (!checkbox_delete_mode.checked) {
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
    points();
  } else {
    for (let i = 0; i < PTS.length; i++) {
      if ((PTS[i].x - mousePos.x) ** 2 + (PTS[i].y - mousePos.y) ** 2 < 100) {
        PTS.splice(i, 1);
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        points();
        calculate_fourier();
      }
    }
  }
});

canvas.addEventListener("pointermove", function (evt) {
  if (mouse_down & !checkbox_delete_mode.checked) {
    var mousePos = get_mouse_pos(canvas, evt);
    PTS[mouse_point] = mousePos;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    points();
  }
});

canvas.addEventListener("pointerup", function (evt) {
  if (mouse_down & !checkbox_delete_mode.checked) {
    mouse_down = false;
    prev_mousePos = undefined;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    points();
    calculate_fourier();
  }
});

// plotting functions //
function points() {
  if (PTS.length == 0) {
    return;
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle = "grey";
  ctx.beginPath();
  ctx.moveTo(PTS[0].x, PTS[0].y);
  for (let i = 1; i < PTS.length; i++) {
    ctx.lineTo(PTS[i].x, PTS[i].y);
  }
  ctx.lineTo(PTS[0].x, PTS[0].y);
  ctx.stroke();
  ctx.closePath();
  ctx.fillStyle = "black";
  for (let i = 0; i < PTS.length; i++) {
    ctx.beginPath();
    ctx.arc(PTS[i].x, PTS[i].y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    if (mouse_down && i == mouse_point) {
      ctx.strokeStyle = "grey";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(PTS[i].x, PTS[i].y, 7, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
    }
  }
}

function plot(t) {
  var x = 0;
  var y = 0;
  ctx.strokeStyle = "grey";
  ctx.lineWidth = 2;
  ctx.moveTo(x, y);
  ctx.beginPath();
  var i = 0;
  for (
    i = 0;
    i < Math.min(COEFFS_POSITIVES.length, COEFFS_NEGATIVES.length);
    i++
  ) {
    const coef_positive = COEFFS_POSITIVES[i];
    const coef_negative = COEFFS_NEGATIVES[i];
    x += coef_positive.r * Math.cos(i * t + coef_positive.a);
    y += coef_positive.r * Math.sin(i * t + coef_positive.a);
    ctx.lineTo(x, y);
    x += coef_negative.r * Math.cos(-i * t + coef_negative.a);
    y += coef_negative.r * Math.sin(-i * t + coef_negative.a);
    ctx.lineTo(x, y);
  }
  for (; i < COEFFS_POSITIVES.length; i++) {
    const coef_positive = COEFFS_POSITIVES[i];
    x += coef_positive.r * Math.cos(i * t + coef_positive.a);
    y += coef_positive.r * Math.sin(i * t + coef_positive.a);
    ctx.lineTo(x, y);
  }
  for (; i < COEFFS_NEGATIVES.length; i++) {
    const coef_negative = COEFFS_NEGATIVES[i];
    x += coef_negative.r * Math.cos(-i * t + coef_negative.a);
    y += coef_negative.r * Math.sin(-i * t + coef_negative.a);
    ctx.lineTo(x, y);
  }

  ctx.stroke();
  TRACE.push({ x: x, y: y });
  if (TRACE.length > (2 * Math.PI) / 0.01) {
    TRACE.shift();
  }
}

function trace() {
  ctx.fillStyle = "black";
  var k = 0;
  for (const point of TRACE) {
    ctx.fillStyle = `rgba(255,0,0,${k / TRACE.length})`;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    k += 1;
  }
}

function render() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  points();
  plot(T);
  trace();
}

function animate() {
  T += 0.01;
  if (T > 2 * Math.PI) {
    T -= 2 * Math.PI;
  }
  render();
}

setInterval(animate, 10);
