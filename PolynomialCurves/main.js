var xs = [];
var ys = [];
var ctx = canvas.getContext("2d");
var POINTER_DOWN = false;

var coefs = [
  tf.variable(tf.scalar(Math.random() * 2 - 1)),
  tf.variable(tf.scalar(Math.random() * 2 - 1)),
  tf.variable(tf.scalar(Math.random() * 2 - 1)),
];
const optimizer = tf.train.sgd(0.5);
var interval_train;

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
  if (xs.length > 0) {
    tf.tidy(() => {
      optimizer.minimize(() => loss(predict(xs), tf.tensor1d(ys)));
    });
  }
}

function map(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

canvas.onpointerdown = function (e) {
  POINTER_DOWN = true;
  var x = map(e.x - canvas.offsetLeft, 0, canvas.width, -1, 1);
  var y = map(e.y - canvas.offsetTop, 0, canvas.height, 1, -1);
  xs.push(x);
  ys.push(y);
  draw();
};
canvas.onpointermove = function (e) {
  if (POINTER_DOWN) {
    var x = map(e.x - canvas.offsetLeft, 0, canvas.width, -1, 1);
    var y = map(e.y - canvas.offsetTop, 0, canvas.height, 1, -1);
    xs[xs.length - 1] = x;
    ys[ys.length - 1] = y;
    draw();
  }
};
canvas.onpointerup = function (e) {
  POINTER_DOWN = false;
  start_training();
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
}

draw();

train_checkbox.onchange = start_training;
function start_training() {
  if (train_checkbox.checked) {
    interval_train = setInterval(() => {
      train();
      draw();
    }, 10);
  } else {
    clearInterval(interval_train);
  }
}
