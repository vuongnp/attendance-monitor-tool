import ndarray from "ndarray";
import ops from "ndarray-ops";
import { Tensor } from "onnxjs";
import cv from "@techstark/opencv-js";
// var ndarray = require("ndarray");
// var ops = require("ndarray-ops");
const target_size = 640;
let dsize = new cv.Size(target_size, target_size);

export async function warmupModel(model, dims) {
  // OK. we generate a random input and call Session.run() as a warmup query
  const size = dims.reduce((a, b) => a * b);
  const warmupTensor = new Tensor(new Float32Array(size), "float32", dims);

  for (let i = 0; i < size; i++) {
    warmupTensor.data[i] = Math.random() * 2.0 - 1.0; // random value [-1.0, 1.0)
  }
  try {
    await model.run([warmupTensor]);
  } catch (e) {
    console.error(e);
  }
}

export function getTensorFromCanvasContext(ctx) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const { data, width, height } = imageData;
  const dataTensor = ndarray(new Float32Array(data), [width, height, 4]);
  const dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [
    1,
    3,
    width,
    height,
  ]);
  ops.assign(
    dataProcessedTensor.pick(0, 0, null, null),
    dataTensor.pick(null, null, 2)
  );
  ops.assign(
    dataProcessedTensor.pick(0, 1, null, null),
    dataTensor.pick(null, null, 1)
  );
  ops.assign(
    dataProcessedTensor.pick(0, 2, null, null),
    dataTensor.pick(null, null, 0)
  );
  ops.divseq(dataProcessedTensor, 255);
  ops.subseq(dataProcessedTensor.pick(0, 0, null, null), 0.485);
  ops.subseq(dataProcessedTensor.pick(0, 1, null, null), 0.456);
  ops.subseq(dataProcessedTensor.pick(0, 2, null, null), 0.406);
  ops.divseq(dataProcessedTensor.pick(0, 0, null, null), 0.229);
  ops.divseq(dataProcessedTensor.pick(0, 1, null, null), 0.224);
  ops.divseq(dataProcessedTensor.pick(0, 2, null, null), 0.225);
  const tensor = new Tensor(new Float32Array(3 * width * height), "float32", [
    1,
    3,
    width,
    height,
  ]);
  tensor.data.set(dataProcessedTensor.data);
  return tensor;
}

export function setContextFromTensor(tensor, ctx) {
  const height = tensor.dims[2];
  const width = tensor.dims[3];
  var t_data = tensor.data;

  let red = 0;
  let green = red + height * width;
  let blue = green + height * width;

  var contextImageData = ctx.getImageData(0, 0, width, height);
  var contextData = contextImageData.data;

  let index = 0;
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      const r = t_data[red++];
      const g = t_data[green++];
      const b = t_data[blue++];

      contextData[index++] = r;
      contextData[index++] = g;
      contextData[index++] = b;
      contextData[index++] = 0xff;
    }
  }

  ctx.putImageData(contextImageData, 0, 0);
}
export function processImgFromCanvas(canvasId) {
  //   var ctx = document.getElementById(canvasId).getContext("2d");
  let imgElement = document.getElementById(canvasId);
  let image = cv.imread(imgElement);
//   const target_size = 640;
  //   const h = ctx.canvas.height;
  //   const w = ctx.canvas.width;
  let img = new cv.Mat();
  let src = new cv.Mat();
  cv.cvtColor(image, img, cv.COLOR_BGR2RGBA, 0);
  cv.resize(img, src, dsize, 0, 0);
  let arr = [];
  if (src.isContinuous()) {
    arr = src.data;
  }
  const dataTensor = ndarray(new Float32Array(arr), [
    target_size,
    target_size,
    4,
  ]);
  const dataProcessedTensor = ndarray(
    new Float32Array(target_size * target_size * 3),
    [1, 3, target_size, target_size]
  );
  ops.assign(
    dataProcessedTensor.pick(0, 0, null, null),
    dataTensor.pick(null, null, 2)
  );
  ops.assign(
    dataProcessedTensor.pick(0, 1, null, null),
    dataTensor.pick(null, null, 0)
  );
  ops.assign(
    dataProcessedTensor.pick(0, 2, null, null),
    dataTensor.pick(null, null, 1)
  );
  ops.subseq(dataProcessedTensor, 127);
  ops.divseq(dataProcessedTensor, 128);
  const tensor = new Tensor(
    new Float32Array(3 * target_size * target_size),
    "float32",
    [1, 3, target_size, target_size]
  );
  tensor.data.set(dataProcessedTensor.data);
  img.delete();
  src.delete();
  return tensor;
}
export function canvasToTensor(canvasId) {
  var ctx = document.getElementById(canvasId).getContext("2d");

  const n = 1;
  const c = 3;
  const h = ctx.canvas.height;
  const w = ctx.canvas.width;

  const out_data = new Float32Array(n * c * h * w);

  // load src context to a tensor
  var srcImgData = ctx.getImageData(0, 0, w, h);
  var src_data = srcImgData.data;

  var src_idx = 0;
  var out_idx_r = 0;
  var out_idx_g = out_idx_r + h * w;
  var out_idx_b = out_idx_g + h * w;

  const norm = 1.0;
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      let src_r = src_data[src_idx++];
      let src_g = src_data[src_idx++];
      let src_b = src_data[src_idx++];
      src_idx++;

      out_data[out_idx_r++] = src_r / norm;
      out_data[out_idx_g++] = src_g / norm;
      out_data[out_idx_b++] = src_b / norm;
    }
  }

  const out = new Tensor(out_data, "float32", [n, c, h, w]);

  return out;
}

export function tensorToCanvas(tensor, canvasId) {
  const h = tensor.dims[2];
  const w = tensor.dims[3];
  var t_data = tensor.data;

  let t_idx_r = 0;
  let t_idx_g = t_idx_r + h * w;
  let t_idx_b = t_idx_g + h * w;

  var dst_ctx = document.getElementById(canvasId).getContext("2d");
  var dst_ctx_imgData = dst_ctx.getImageData(0, 0, w, h);
  var dst_ctx_data = dst_ctx_imgData.data;

  let dst_idx = 0;
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      let r = t_data[t_idx_r++];
      let g = t_data[t_idx_g++];
      let b = t_data[t_idx_b++];

      dst_ctx_data[dst_idx++] = r;
      dst_ctx_data[dst_idx++] = g;
      dst_ctx_data[dst_idx++] = b;
      dst_ctx_data[dst_idx++] = 0xff;
    }
  }

  dst_ctx.putImageData(dst_ctx_imgData, 0, 0);
}
const box_iou = (box1, box2) => {
  // (x1,y1,x2,y2) box1
  let x11 = box1[0];
  let y11 = box1[1];
  let x12 = box1[2];
  let y12 = box1[3];
  // (x1,y1,x2,y2) box2
  let x21 = box2[0];
  let y21 = box2[1];
  let x22 = box2[2];
  let y22 = box2[3];
  //area1
  let area1 = (x12 - x11) * (y12 - y11);
  //area2
  let area2 = (x22 - x21) * (y22 - y21);
  //intersection
  let x1 = Math.max(x11, x21);
  let x2 = Math.min(x12, x22);
  let y1 = Math.max(y11, y21);
  let y2 = Math.min(y12, y22);
  let intersection = (x2 - x1) * (y2 - y1);
  let iou = intersection / (area1 + area2 - intersection);
  return iou;
};
export function nms(
  width,
  height,
  scores,
  boxes,
  iou_threshold,
  conf_threshold
) {
  let zipped = [];
  for (let i = 0; i < scores.length; i++) {
    if (scores[i] > conf_threshold) {
      zipped.push([
        scores[i],
        [boxes[i][0], boxes[i][1], boxes[i][2], boxes[i][3]],
      ]);
    }
  }
  // sort by score
  const sorted = zipped.sort((a, b) => b[0] - a[0]);
  const selected = [];
  sorted.forEach((box) => {
    let toAdd = true;
    for (let i = 0; i < selected.length; i++) {
      const iou = box_iou(box[1], selected[i][1]);
      if (iou > iou_threshold) {
        toAdd = false;
      }
    }

    if (toAdd) {
      selected.push(box);
    }
  });
  selected.forEach((item) => {
    item[1][0] = parseInt(item[1][0] * width);
    item[1][1] = parseInt(item[1][1] * height);
    item[1][2] = parseInt(item[1][2] * width);
    item[1][3] = parseInt(item[1][3] * height);
  });
  return selected;
}
// export function drawAfterDetect(canvasid, det) {
//   var canvasDes = document.getElementById(canvasid);
//   var context = canvasDes.getContext("2d");
//   // context.beginPath();
//   let x = det[1][0];
//   let y = det[1][1];
//   let w = det[1][2] - x;
//   let h = det[1][3] - y;
//   context.lineWidth = 5;
//   context.strokeStyle = "green";
//   context.strokeRect(x, y, w, h);
//   context.stroke();
// }
export function drawAfterDetect(canvasid, dets) {
  var canvasDes = document.getElementById(canvasid);
  var context = canvasDes.getContext("2d");
  // context.beginPath();
  for (var i=0;i<dets.length;i++){
    let x = dets[i][1][0];
    let y = dets[i][1][1];
    let w = dets[i][1][2] - x;
    let h = dets[i][1][3] - y;
    context.lineWidth = 5;
    context.strokeStyle = "green";
    context.strokeRect(x, y, w, h);
    context.stroke();
  }
  
}
