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
var COEFFS = [];
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
  COEFFS = [];
  var x = 0;
  var y = 0;
  for (let i = 0; i < PTS.length; i++) {
    const point = PTS[i];
    x += point.x;
    y += point.y;
  }
  x /= PTS.length;
  y /= PTS.length;
  const p = cartesian_to_polar(x, y);
  COEFFS.push({ r: p.r, a: p.a, k: 0 });
  var c = 1;
  for (
    let k = -Number(number_fourier_min.value);
    (k <= Number(number_fourier_max.value)) & (c < PTS.length);
    k++
  ) {
    if (k == 0) {
      continue;
    }
    c += 1;
    var x = 0;
    var y = 0;
    for (let i = 0; i < PTS.length; i++) {
      const point = PTS[i];
      var point_pol = cartesian_to_polar(point.x, point.y);
      point_pol.a += k * (i / PTS.length) * 2 * Math.PI;
      var point_cart = polar_to_cartesian(point_pol.r, point_pol.a);
      x += point_cart.x;
      y += point_cart.y;
    }
    x /= PTS.length;
    y /= PTS.length;
    const p = cartesian_to_polar(x, y);
    COEFFS.push({ r: p.r, a: p.a, k: k });
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
    if (evt.shiftKey) {
      mousePos.x = mousePos.x - (mousePos.x % 10);
      mousePos.y = mousePos.y - (mousePos.y % 10);
    }
    if (evt.ctrlKey) {
      mousePos.x = mousePos.x - (mousePos.x % 50);
      mousePos.y = mousePos.y - (mousePos.y % 50);
    }
    PTS[mouse_point] = mousePos;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    points();
  }
});

canvas.addEventListener("pointerup", function (evt) {
  if (mouse_down & !checkbox_delete_mode.checked) {
    var mousePos = get_mouse_pos(canvas, evt);
    if (evt.shiftKey) {
      mousePos.x = mousePos.x - (mousePos.x % 10);
      mousePos.y = mousePos.y - (mousePos.y % 10);
    }
    if (evt.ctrlKey) {
      mousePos.x = mousePos.x - (mousePos.x % 50);
      mousePos.y = mousePos.y - (mousePos.y % 50);
    }
    PTS[mouse_point] = mousePos;
    mouse_down = false;
    prev_mousePos = undefined;
    if (symmetric_coef.checked) {
      const new_val = Math.min(
        Number(number_fourier_min.value),
        Math.floor((PTS.length - 1) / 2)
      );
      number_fourier_min.value = new_val;
      range_fourier_min.value = new_val;
      number_fourier_max.value = new_val;
      range_fourier_max.value = new_val;
    } else {
      if (
        Number(number_fourier_min.value) +
          Number(number_fourier_max.value) +
          1 >
        PTS.length
      ) {
        const new_max = PTS.length - Number(number_fourier_min.value) - 1;
        if (new_max >= 0) {
          number_fourier_max.value = new_max;
          range_fourier_max.value = new_max;
        } else {
          number_fourier_max.value = 0;
          range_fourier_max.value = 0;
          if (Number(number_fourier_min.value) + 1 > PTS.length) {
            const new_min = PTS.length - 1;
            number_fourier_min.value = new_min;
            range_fourier_min.value = new_min;
          }
        }
      }
    }
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    points();
    calculate_fourier();
  }
});

function changed_symmetric() {
  if (symmetric_coef.checked) {
    const new_val = Math.floor(
      (Number(number_fourier_min.value) + Number(number_fourier_max.value)) / 2
    );
    number_fourier_min.value = new_val;
    range_fourier_min.value = new_val;
    number_fourier_max.value = new_val;
    range_fourier_max.value = new_val;
    calculate_fourier();
  }
}
function changed_min() {
  if (symmetric_coef.checked) {
    const new_val = Math.min(
      Number(number_fourier_min.value),
      Math.floor((PTS.length - 1) / 2)
    );
    number_fourier_min.value = new_val;
    range_fourier_min.value = new_val;
    number_fourier_max.value = new_val;
    range_fourier_max.value = new_val;
    calculate_fourier();
    return;
  }
  if (
    Number(number_fourier_min.value) + Number(number_fourier_max.value) + 1 >
    PTS.length
  ) {
    const new_max = PTS.length - Number(number_fourier_min.value) - 1;
    if (new_max < 0) {
      number_fourier_max.value = 0;
      range_fourier_max.value = 0;
      changed_max();
    } else {
      number_fourier_max.value = new_max;
      range_fourier_max.value = new_max;
      calculate_fourier();
    }
  }
  calculate_fourier();
}

function changed_max() {
  if (symmetric_coef.checked) {
    const new_val = Math.min(
      Number(number_fourier_max.value),
      Math.floor((PTS.length - 1) / 2)
    );
    number_fourier_min.value = new_val;
    range_fourier_min.value = new_val;
    number_fourier_max.value = new_val;
    range_fourier_max.value = new_val;
    calculate_fourier();
    return;
  }
  if (
    Number(number_fourier_min.value) + Number(number_fourier_max.value) + 1 >
    PTS.length
  ) {
    const new_min = PTS.length - Number(number_fourier_max.value) - 1;
    if (new_min < 0) {
      number_fourier_min.value = 0;
      range_fourier_min.value = 0;
      changed_min();
    } else {
      number_fourier_min.value = new_min;
      range_fourier_min.value = new_min;
      calculate_fourier();
    }
  }
  calculate_fourier();
}
changed_max();

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

/* URL params */
function save() {
  var params = "";
  params += "POINTS=[";
  PTS.forEach((pt) => {
    params += `{x:${Math.round(pt.x)},y:${Math.round(pt.y)}},`;
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
