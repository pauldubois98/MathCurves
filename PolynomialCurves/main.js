var xs = [];
var ys = [];
var ctx = canvas.getContext("2d");
var POINTER_DOWN = false;

function map(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}
