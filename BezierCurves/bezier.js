var canvas = document.getElementById("bezier-canvas");
const WIDTH = canvas.clientWidth;
const HEIGHT = canvas.clientHeight;
var n = range_pts.value;
var t = nb_t.value;
var xs = [];
var ys = [];
var trace_xs = [];
var trace_ys = [];
var ctx = canvas.getContext("2d");
var mouse_down = false;
var mouse_x = 0;
var mouse_y = 0;
var mouse_point = 0;
var point_selected = false;
var animation = undefined;

/* points creation */
function set_pts() {
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
  rerender();
}

/* math functions */
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

/* render part */
function intermediates(l, t) {
  new_l = [];
  for (let i = 1; i < l.length; i++) {
    const p1 = l[i - 1];
    const p2 = l[i];
    new_l.push((1 - t) * p1 + p2 * t);
  }
  return new_l;
}
function rerender() {
  trace_xs = [];
  trace_ys = [];
  for (let rt = 0; rt < t; rt += 0.0001 * Math.max(animation_speed.value, 1)) {
    var xs_copy = xs;
    var ys_copy = ys;
    while (xs_copy.length > 0) {
      ctx.fillStyle = "black";
      xs_copy = intermediates(xs_copy, rt);
      ys_copy = intermediates(ys_copy, rt);
      if (xs_copy.length == 1) {
        trace_xs.push(xs_copy[0]);
        trace_ys.push(ys_copy[0]);
      }
    }
  }
  render();
}
function render() {
  var xs_copy = xs;
  var ys_copy = ys;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  while (xs_copy.length > 0) {
    // draw points
    ctx.fillStyle = "black";
    if (xs_copy.length == n) {
      for (let i = 0; i < xs_copy.length; i++) {
        const x = xs_copy[i];
        const y = ys_copy[i];
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    } else {
      for (let i = 0; i < xs_copy.length; i++) {
        const x = xs_copy[i];
        const y = ys_copy[i];
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    // draw segments
    if (xs_copy.length == n) {
      ctx.strokeStyle = "grey";
    } else {
      var h = 2 * Math.PI * ((xs_copy.length - 2) / (n - 2));
      var r = Math.round(127 * (Math.cos(h + Math.PI * (0 / 3)) + 1));
      var g = Math.round(127 * (Math.cos(h + Math.PI * (2 / 3)) + 1));
      var b = Math.round(127 * (Math.cos(h + Math.PI * (4 / 3)) + 1));
      ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
    }
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
  ctx.beginPath();
  ctx.moveTo(trace_xs[0], trace_ys[0]);
  for (let i = 1; i < trace_xs.length; i++) {
    const x = trace_xs[i];
    const y = trace_ys[i];
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  // point selection
  if (point_selected) {
    ctx.strokeStyle = "dimgrey";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(xs[mouse_point], ys[mouse_point], 6, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

/* animatin part */
function animate() {
  t += 0.0001 * animation_speed.value;
  range_t.value = t * 100;
  nb_t.value = t;
  if (t > 1) {
    t = 0;
    trace_xs = [];
    trace_ys = [];
  }
  render();
}
function change_animate() {
  if (animate_checkbox.checked) {
    animation = setInterval(animate, 5);
  } else {
    clearInterval(animation);
  }
}

/* click part */
canvas.onmousedown = function (e) {
  var rect = canvas.getBoundingClientRect();
  mouse_x = e.clientX - rect.left;
  mouse_y = e.clientY - rect.top;
  point_selected = false;
  for (let i = 0; i < xs.length; i++) {
    if ((xs[i] - mouse_x) ** 2 + (ys[i] - mouse_y) ** 2 < 100) {
      mouse_point = i;
      point_selected = true;
    }
  }
  mouseIsDown = true;
  render();
};
canvas.onmouseup = function (e) {
  mouseIsDown = false;
  point_selected = false;
  rerender();
};
canvas.onmousemove = function (e) {
  if (!point_selected) return;
  var rect = canvas.getBoundingClientRect();
  dx = e.clientX - rect.left - mouse_x;
  dy = e.clientY - rect.top - mouse_y;
  mouse_x = e.clientX - rect.left;
  mouse_y = e.clientY - rect.top;
  xs[mouse_point] += dx;
  ys[mouse_point] += dy;
  render();
  return false;
};

/* URL params load */
const URL_PARAMS = new URLSearchParams(window.location.search);
if (URL_PARAMS.get("n") !== null) {
  n = Math.max(2, Math.min(10, Number(URL_PARAMS.get("n"))));
  nb_pts.value = n;
  range_pts.value = n;
}
set_pts();
if (URL_PARAMS.get("xs") !== null) {
  xs = eval(URL_PARAMS.get("xs"));
}
if (URL_PARAMS.get("ys") !== null) {
  ys = eval(URL_PARAMS.get("ys"));
}
if (URL_PARAMS.get("t") !== null) {
  t = Math.max(0, Math.min(1, Number(URL_PARAMS.get("t"))));
  range_t.value = t * 100;
  nb_t.value = t;
}
rerender();
if (URL_PARAMS.get("animation") !== null) {
  if (URL_PARAMS.get("animation") == "on") {
    animate_checkbox.checked = true;
  } else {
    animate_checkbox.checked = false;
  }
}
change_animate();

/* URL params save */
function save() {
  var params = "";
  params += "n=" + String(n) + "&";
  params += "t=" + String(t) + "&";
  if (animate_checkbox.checked) {
    params += "animation=on&";
  } else {
    params += "animation=off&";
  }
  params += "xs=[" + String(xs) + "]&ys=[" + String(ys) + "]";
  var old_url = window.location.href.split("?")[0];
  new_url = old_url + "?" + params;
  window.location.replace(new_url);
}
