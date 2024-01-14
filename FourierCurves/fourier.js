var canvas = document.getElementById("fourier-canvas");
const WIDTH = canvas.clientWidth;
const HEIGHT = canvas.clientHeight;
var ctx = canvas.getContext("2d");
var mouse_down = false;
var mouse_point = undefined;
var PTS = [];
var COEFFS = [
  { r: 347.5359693614461, a: 0.65788860518221, k: 0 },
  { r: 100, a: 0, k: 1 },
  { r: 50, a: 0, k: -1 },
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

// event listeners //
function changed_symmetric() {
  if (symmetric_coef.checked) {
    const new_val = Math.floor(
      (Number(number_fourier_min.value) + Number(number_fourier_max.value)) / 2
    );
    number_fourier_min.value = new_val;
    number_fourier_max.value = new_val;
  }
  changed_coef();
}
function component_summand(k) {
  return `<div class="summand">
            <div>
              <label for="coef${k}" class="coef_label">r<sub>${k}</sub> =</label>
              <input type="number" id="coef${k}r" min="0" max="250"
              value="${k * 20}" oninput="update_coef()">
            </div>
            <div>
              <label for="coef${k}a" class="coef_label">a<sub>${k}</sub> =</label>
              <input type="number" id="coef${k}a" min="0" max="360"
              value="${k * 10}" oninput="update_coef()">
            </div>
          </div>`;
}

function changed_coef_min() {
  if (symmetric_coef.checked) {
    number_fourier_max.value = number_fourier_min.value;
  }
  changed_coef();
}
function changed_coef_max() {
  if (symmetric_coef.checked) {
    number_fourier_min.value = number_fourier_max.value;
  }
  changed_coef();
}
function changed_coef() {
  var html = "";
  const min = -Number(number_fourier_min.value);
  const max = Number(number_fourier_max.value);
  for (let i = min; i <= max; i++) {
    if (i === 0) {
      continue;
    }
    html += component_summand(i);
  }
  document.getElementById("summands").innerHTML = html;
  update_coef();
}
changed_coef();

function update_coef() {
  TRACE = [];
  COEFFS = [{ r: 420, a: 0.78539816339, k: 0 }];
  const min = -Number(number_fourier_min.value);
  const max = Number(number_fourier_max.value);
  for (let i = min; i <= max; i++) {
    if (i === 0) {
      continue;
    }
    const a = Number(document.getElementById("coef" + i + "a").value);
    const r = Number(document.getElementById("coef" + i + "r").value);
    COEFFS.push({ r: r, a: (a * Math.PI) / 180, k: i });
  }
}

// rendering functions //
function plot(t) {
  var x = 0;
  var y = 0;
  ctx.strokeStyle = "grey";
  ctx.lineWidth = 2;
  ctx.moveTo(x, y);
  ctx.beginPath();
  for (let i = 0; i < COEFFS.length; i++) {
    const coef = COEFFS[i];
    x += coef.r * Math.cos(coef.k * t + coef.a);
    y += coef.r * Math.sin(coef.k * t + coef.a);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  TRACE.push({ x: x, y: y });
  if (TRACE.length > (2 * Math.PI) / 0.01) {
    TRACE.shift();
  }
}

function trace() {
  var k = 0;
  for (var i = 0; i < TRACE.length - 1; i++) {
    ctx.strokeStyle = `rgba(255,0,0,${(2 * k) / TRACE.length})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(TRACE[i].x, TRACE[i].y);
    ctx.lineTo(TRACE[i + 1].x, TRACE[i + 1].y);
    ctx.stroke();
    ctx.closePath();
    k += 1;
  }
}

function render() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
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

/* URL params */
function save() {
  var params = "";
  params += "COEFFS=[";
  PTS.forEach((pt) => {
    params += `{x:${pt.x},y:${pt.y}},`;
  });
  params += "]";
  var old_url = window.location.href.split("?")[0];
  new_url = old_url + "?" + params;
  setTimeout(function () {
    window.location.replace(new_url);
  }, 1000);
}

const URL_PARAMS = new URLSearchParams(window.location.search);
if (URL_PARAMS.get("POINTS") !== null) {
  PTS = eval(URL_PARAMS.get("POINTS"));
  setTimeout(function () {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    points();
    calculate_fourier();
  }, 100);
}
