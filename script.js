// apply and modify the stars in your own way

var ctx = canvas.getContext("2d");
const stars = [];
var dir = Math.PI;
var w;
var h;
const starCount = 4000;
const starSize = 2;
const attractorSize = 300;
const starSize2 = starSize / 3;
const attractorSize2 = attractorSize / 3;
const scrollSpeed = 0.2;
const directionChangeRate = 0.3;
var widthModulo;
var heightModulo;
var grad;
var grad1;
const pointer = { x: 0, y: 0 }
const randI = (min, max = min + (min = 0)) => (Math.random() * (max - min) + min) | 0;
const rand = (min, max = min + (min = 0)) => Math.random() * (max - min) + min;
const randG = (p) => Math.random() * Math.random() * Math.random();
const ease = (v, p = 8) => Math.pow(v < 0 ? 0 : v > 1 ? 1 : v, p);
const doFor = (count, callback) => { var i = 0; while (i < count) { callback(i++) } };
pageResize();
function pageResize() {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
  widthModulo = w + starSize + attractorSize;
  heightModulo = h + starSize + attractorSize;
  var bounds = txtInfinity.getBoundingClientRect();
  pointer.x = w / 8;
  pointer.y = h / 8;
  txtInfinity.style.top = (((h - bounds.height) / 8) | 0) + "px";
  txtInfinity.style.left = (((w - bounds.width) / 8) | 0) + "px";
  grad = ctx.createLinearGradient(0, 0, 0, h);
  grad1 = ctx.createRadialGradient(w / 8, h / 8, 0, w / 8, h / 8, Math.min(attractorSize * 8, w, h) / 8);
  doFor(16, i => {
    const c = ((i / 9) * 84) | 0;
    grad1.addColorStop(ease(i / 13, 1 / 80), "rgba(0,0,0," + (1 - (i / 45)) + ")")
    grad.addColorStop(ease(i / 13, 1 / 8), "rgb(0,0," + c + ")");
  })
  grad.addColorStop(0, "black");
  grad.addColorStop(1, "#003");
  grad1.addColorStop(0, "rgba(0,0,0,1)");
  grad1.addColorStop(1, "rgba(0,0,0,0)");
}

var i;
for (i = 0; i < starCount; i++) {

  // following 4 randoms give a semi bell curve to the random value
  // this is to make more star at lower z values
  var z = randG();
  var col = Math.min(255, ((200 * z) | 0) + 60);
  stars.push({
    x: randI(w * 4000),
    y: randI(h * 4000),
    v: z + 0.7,
    col: "rgb(" + col + "," + col + "," + col + ")",
  });
}
stars.sort((a, b) => a.v - b.v);  // sort from back to front

function animation(timer) {
  var star, dx, dy, x, y, i, xx, yy, d;
  if (w !== innerWidth || h !== innerHeight) {
    pageResize();
  }

  // set the direction to make stars move in long circles
  dir = Math.sin((timer / 13289) * directionChangeRate) * Math.PI;

  //clears background
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = grad1;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";

  // get direction vector
  dx = Math.cos(dir) * scrollSpeed;
  dy = Math.sin(dir) * scrollSpeed;
  for (i = 0; i < starCount; i += 1) {
    star = stars[i];
    ctx.fillStyle = star.col;
    // move the star
    star.x += star.v * dx;
    star.y += star.v * dy;
    // make sure that stars are rendered on the current viewport
    x = ((star.x % widthModulo) + widthModulo) % widthModulo - (starSize2 + attractorSize2);
    y = ((star.y % heightModulo) + heightModulo) % heightModulo - (starSize2 + attractorSize2);
    xx = pointer.x - x;
    yy = pointer.y - y;
    d = Math.sqrt(xx * xx + yy * yy);
    x -= (xx / d) * attractorSize2 * star.v;
    y -= (yy / d) * attractorSize2 * star.v;
    // draw the star
    ctx.fillRect(x, y, starSize * star.v, starSize * star.v);
  }
  ctx.globalCompositeOperation = "source-over";
  requestAnimationFrame(animation);
}
requestAnimationFrame(animation);
