var dataArray, ctx, analyser;
var size = 512;
var hsize = Math.floor(size / 2);
var width = 854;
var height = 240;

function init(canvas) {
    if (canvas) return;

    console.log("debug init:start");
    var video = document.querySelector("video");
    var target = document.querySelector("#info-contents");
    console.log("debug init: got video:", video);
    console.log("debug init: got target:", target);

    canvas = document.createElement('canvas');
    canvas.id = "NewCanvas";
    canvas.width = width;
    canvas.height = height;
    if (target) target.insertAdjacentElement('afterbegin', canvas);
    else document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(42, 42, 42)';
    ctx.fillRect(0, 0, width, height);

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    var source = audioCtx.createMediaElementSource(video);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = size;
    var bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    for (var i = 0; i < hsize; i++)bar(i, dataArray[i]);
    setInterval(onFrame, 30);
}
function bar(i, y) {
    ctx.fillStyle = hslToRgb(i / 255, 1, 0.5);
    ctx.fillRect(i * 4, 0, 3, y);
}
function onFrame() {
    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = 'rgb(42, 42, 42)';
    ctx.fillRect(0, 0, width, height);
    for (var i = 0; i < hsize; i++)bar(i, dataArray[i]);
}
function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return "rgb(" + (r * 255) + "," + (g * 255) + "," + (b * 255) + ")";
}
console.log("WTF DUDE? NO CLICK!!");
var c = document.querySelector("#NewCanvas");
init(c);