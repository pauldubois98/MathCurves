var canvas = document.getElementById("fourier-canvas");
const WIDTH = canvas.clientWidth;
const HEIGHT = canvas.clientHeight;
var ctx = canvas.getContext("2d");
var mouse_down = false;
var PTS = [];
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
    x: Math.round(evt.clientX - rect.left),
    y: Math.round(evt.clientY - rect.top),
  };
}
function get_interpolation(pt1, pt2) {
  var x = pt1.x;
  var y = pt1.y;
  var dx = 0;
  var dy = 0;
  var OUTPTS = [];
  if (Math.abs(pt1.x - pt2.x) + Math.abs(pt1.y - pt2.y) <= 2) {
    return OUTPTS;
  }
  if (Math.abs(pt1.x - pt2.x) < Math.abs(pt1.y - pt2.y)) {
    dx = (pt2.x - pt1.x) / Math.abs(pt2.y - pt1.y);
    if (pt2.y - pt1.y > 0) {
      dy = 1;
    } else if (pt2.y - pt1.y < 0) {
      dy = -1;
    }
    var k = 0;
    while (Math.abs(y - pt2.y) > 0 && k < 1000) {
      k += 1;
      x += dx;
      y += dy;
      OUTPTS.push({ x: Math.round(x + 0.5), y: y });
    }
  } else if (Math.abs(pt2.x - pt1.x) > Math.abs(pt2.y - pt1.y)) {
    dy = (pt2.y - pt1.y) / Math.abs(pt2.x - pt1.x);
    if (pt2.x - pt1.x > 0) {
      dx = 1;
    } else if (pt2.x - pt1.x < 0) {
      dx = -1;
    }
    var k = 0;
    while (Math.abs(x - pt2.x) > 0 && k < 1000) {
      k += 1;
      x += dx;
      y += dy;
      OUTPTS.push({ x: x, y: Math.round(y + 0.5) });
    }
  } else if (Math.abs(pt2.x - pt1.x) == Math.abs(pt2.y - pt1.y)) {
    if (pt2.x - pt1.x > 0) {
      dx = 1;
    } else if (pt2.x - pt1.x < 0) {
      dx = -1;
    }
    if (pt2.y - pt1.y > 0) {
      dy = 1;
    } else if (pt2.y - pt1.y < 0) {
      dy = -1;
    }
    var k = 0;
    while (Math.abs(x - pt2.x) > 0 && k < 1000) {
      k += 1;
      x += dx;
      y += dy;
      OUTPTS.push({ x: x, y: y });
    }
  }
  return OUTPTS;
}
canvas.addEventListener("pointerdown", function (evt) {
  var mousePos = get_mouse_pos(canvas, evt);
  PTS = [mousePos];
  mouse_down = true;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  points();
});

canvas.addEventListener("pointermove", function (evt) {
  if (mouse_down) {
    var mousePos = get_mouse_pos(canvas, evt);
    var prev_mousePos = PTS[PTS.length - 1];
    PTS = PTS.concat(get_interpolation(prev_mousePos, mousePos));
    PTS.push(mousePos);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    points();
  }
});

canvas.addEventListener("pointerup", function (evt) {
  if (mouse_down) {
    var mousePos = get_mouse_pos(canvas, evt);
    PTS.push(mousePos);
    mouse_down = false;
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
  if (PTS.length == 0) {
    return;
  }
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
  if (PTS.length == 0) {
    return;
  }
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
    ctx.arc(PTS[i].x, PTS[i].y, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
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
  points();
  plot(T);
  trace();
}

function animate() {
  T += 0.01;
  if (T > 2 * Math.PI) {
    T -= 2 * Math.PI;
  }
  if (!mouse_down) {
    render();
  }
}

setInterval(animate, 10);

/* URL params */
function save() {
  var params = "";
  params += "POINTS=[";
  PTS.forEach((pt) => {
    params += `{x:${pt.x},y:${pt.y}},`;
  });
  params += "]";
  params += "&min=" + number_fourier_min.value;
  params += "&max=" + number_fourier_max.value;
  var old_url = window.location.href.split("?")[0];
  new_url = old_url + "?" + params;
  setTimeout(function () {
    window.location.replace(new_url);
  }, 1000);
}

const URL_PARAMS = new URLSearchParams(window.location.search);
if (URL_PARAMS.get("min") !== null) {
  number_fourier_min.value = URL_PARAMS.get("min");
  range_fourier_min.value = URL_PARAMS.get("min");
}
if (URL_PARAMS.get("max") !== null) {
  number_fourier_max.value = URL_PARAMS.get("max");
  range_fourier_max.value = URL_PARAMS.get("max");
}
if (URL_PARAMS.get("POINTS") !== null) {
  PTS = eval(URL_PARAMS.get("POINTS"));
  setTimeout(function () {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    points();
    calculate_fourier();
  }, 100);
}
