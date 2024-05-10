var xs = [];
var ys = [];
var ctx = canvas.getContext("2d");
var POINTER_DOWN = false;

// read get parameters
var url = new URL(window.location.href);
var coefs = [];
coefs_vals = url.searchParams.get("coefs");
if (coefs_vals != null) {
  coefs_vals = coefs_vals.split(",");
  for (var i = 0; i < coefs_vals.length; i++) {
    coefs.push(tf.variable(tf.scalar(parseFloat(coefs_vals[i]))));
  }
  degree_input.value = coefs.length - 1;
} else {
  degree = parseFloat(url.searchParams.get("degree"));
  if (degree == null || isNaN(degree) || degree < 0 || degree % 1 != 0) {
    // default degree
    degree = 2;
  }
  degree_input.value = degree;
  for (var i = 0; i < degree + 1; i++) {
    coefs.push(tf.variable(tf.scalar(Math.random() * 2 - 1)));
  }
  delete degree;
}
delete coefs_vals;

var optimizer;
lr = parseFloat(url.searchParams.get("lr"));
if (lr == null || isNaN(lr)) {
  // default learning rate
  lr = 0.5;
}
lr_input.value = lr;
var optimizer = tf.train.sgd(0.5);

function predict(xs) {
  var x = tf.tensor1d(xs);
  var y = x.pow(tf.scalar(0)).mul(coefs[0]);
  for (var i = 1; i < coefs.length; i++) {
    y = y.add(x.pow(tf.scalar(i)).mul(coefs[i]));
  }
  return y;
}

function loss(pred, label) {
  return pred.sub(label).square().mean();
}

function train() {
  if (xs.length > 0 && !(POINTER_DOWN && drag_mode_checkbox.checked)) {
    tf.tidy(() => {
      optimizer.minimize(() => loss(predict(xs), tf.tensor1d(ys)));
    });
  }
}

function map(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

canvas.onpointerdown = function (e) {
  if (e.button == 0) {
    POINTER_DOWN = true;
    var x = map(e.pageX - canvas.offsetLeft, 0, canvas.width, -1, 1);
    var y = map(e.pageY - canvas.offsetTop, 0, canvas.height, 1, -1);
    xs.push(x);
    ys.push(y);
    draw();
  }
};
canvas.onpointermove = function (e) {
  if (POINTER_DOWN && !drag_mode_checkbox.checked) {
    var x = map(e.pageX - canvas.offsetLeft, 0, canvas.width, -1, 1);
    var y = map(e.pageY - canvas.offsetTop, 0, canvas.height, 1, -1);
    xs[xs.length - 1] = x;
    ys[ys.length - 1] = y;
    draw();
  }
  if (POINTER_DOWN && drag_mode_checkbox.checked) {
    var x = map(e.pageX - canvas.offsetLeft, 0, canvas.width, -1, 1);
    var y = map(e.pageY - canvas.offsetTop, 0, canvas.height, 1, -1);
    var min_dist = 10000;
    for (var i = 0; i < xs.length; i++) {
      var dist = Math.sqrt((xs[i] - x) ** 2 + (ys[i] - y) ** 2);
      if (dist < min_dist) {
        min_dist = dist;
      }
    }
    if (min_dist > 0.05) {
      xs.push(x);
      ys.push(y);
      draw();
    }
  }
};
canvas.onpointerleave = function (e) {
  POINTER_DOWN = false;
};
canvas.onpointerup = function (e) {
  POINTER_DOWN = false;
  if (e.button == 2) {
    var closer_index = -1;
    var min_dist = 10000;
    var x = map(e.pageX - canvas.offsetLeft, 0, canvas.width, -1, 1);
    var y = map(e.pageY - canvas.offsetTop, 0, canvas.height, 1, -1);
    for (var i = 0; i < xs.length; i++) {
      var dist = Math.sqrt((xs[i] - x) ** 2 + (ys[i] - y) ** 2);
      if (dist < min_dist) {
        min_dist = dist;
        closer_index = i;
      }
    }
    if (closer_index != -1) {
      xs.splice(closer_index, 1);
      ys.splice(closer_index, 1);
    }
    draw();
  }
};
canvas.oncontextmenu = function (e) {
  e.preventDefault();
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < xs.length; i++) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    var x = map(xs[i], -1, 1, 0, canvas.width);
    var y = map(ys[i], 1, -1, 0, canvas.height);
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
  ctx.beginPath();
  ctx.strokeStyle = "red";
  tf.tidy(() => {
    var pred_xs = tf.linspace(-1, 1, 100).dataSync();
    var pred_ys = predict(pred_xs).dataSync();
    for (var i = 0; i < pred_xs.length; i++) {
      ctx.lineTo(
        map(pred_xs[i], -1, 1, 0, canvas.width),
        map(pred_ys[i], 1, -1, 0, canvas.height)
      );
    }
  });
  ctx.stroke();
  ctx.closePath();
  write();
}
function write() {
  var txt = "f(x) = ";
  for (var i = coefs.length - 1; i > 1; i--) {
    txt += coefs[i].dataSync()[0].toFixed(2) + "x<sup>" + i + "</sup> + ";
  }
  if (coefs.length > 1) {
    txt += coefs[1].dataSync()[0].toFixed(2) + "x + ";
  }
  if (coefs.length > 0) {
    txt += coefs[0].dataSync()[0].toFixed(2);
  }
  if (func_disp.innerHTML != txt) {
    func_disp.innerHTML = txt;
  }
}

train_checkbox.onchange = train_loop;
function train_loop() {
  if (train_checkbox.checked) {
    train();
    draw();
    setTimeout(train_loop, 10);
  }
}

sgd_radio.onchange = function () {
  lr_input.value = 0.5;
  update_optimizer();
};
adam_radio.onchange = function () {
  lr_input.value = 0.1;
  update_optimizer();
};
rmsprop_radio.onchange = function () {
  lr_input.value = 0.01;
  update_optimizer();
};
lr_input.onchange = update_optimizer;
function update_optimizer() {
  if (sgd_radio.checked) {
    optimizer = tf.train.sgd(parseFloat(lr_input.value));
  } else if (adam_radio.checked) {
    optimizer = tf.train.adam(parseFloat(lr_input.value));
  } else if (rmsprop_radio.checked) {
    optimizer = tf.train.rmsprop(parseFloat(lr_input.value));
  }
}

reset_points_button.onclick = function () {
  xs = [];
  ys = [];
  draw();
};

reset_coefs_button.onclick = function () {
  for (var i = 0; i < coefs.length; i++) {
    coefs[i].assign(tf.scalar(Math.random() * 2 - 1));
  }
};

degree_input.onchange = update_degree;
function update_degree() {
  var degree = parseInt(degree_input.value);
  while (coefs.length < degree + 1) {
    coefs.push(tf.variable(tf.scalar(Math.random() * 2 - 1)));
  }
  while (coefs.length > degree + 1) {
    coefs.pop();
  }
  draw();
}

update_degree();
update_optimizer();
train_loop();
