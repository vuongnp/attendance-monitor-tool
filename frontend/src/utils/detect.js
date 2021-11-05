import cv from "@techstark/opencv-js";
import { Tensor, InferenceSession } from "onnxjs";
import { loadDataFile } from "./dataFile";
var ndarray = require("ndarray");
var ops = require("ndarray-ops");
// const msize = new cv.Size(0, 0);
// let faceCascade;
const target_size = 640;
let dsize = new cv.Size(target_size, target_size);
let session;

// export async function loadDetectModel() {
//   //   console.log("=======start downloading Haar-cascade models=======");
//   //   return loadDataFile(
//   //     "haarcascade_frontalface_default.xml",
//   //     "models/haarcascade_frontalface_default.xml"
//   //   )
//   //     .then(
//   return loadDataFile()
//     .then(
//       () =>
//         new Promise((resolve) => {
//         //   setTimeout(() => {
//             // load pre-trained classifiers
//             // faceCascade = new cv.CascadeClassifier();
//             console.log("Session create");
//             session = await new InferenceSession({ backendHint: "cpu" });
//             // let url = "../models/face-detect-RFB.onnx";
//             console.log(session);
//             console.log("Loading model");
//             await session.loadModel("face-detect-RFB.onnx");
//             console.log(session);
//             console.log("Model loaded");
//             // faceCascade.load("haarcascade_frontalface_default.xml");
//             resolve();
//         //   }, 2000);
//         })
//     )
//     .then(() => {
//       console.log("Detect models=======");
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

/**
 * Detect faces from the input image.
 * See https://docs.opencv.org/master/d2/d99/tutorial_js_face_detection.html
 * @param {cv.Mat} org_img Input image
 * @returns the modified image with detected faces drawn on it.
 */
export function detectFaceRBF(org_img) {
//   console.log(org_img.data);
  // const newImg = img.clone();
  const image = org_img;

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
//   console.log(tensor.data);
//   const outputMap = session.run([tensor]);
//   console.log(outputMap);
//   const outputTensor = outputMap.values().next().value;
  img.delete();
  src.delete();
  return tensor;
//   console.log(outputTensor);
//   return outputTensor;

  //   gray.delete();
  //   faces.delete();

  //   return newImg;
}

// /**
//  * Detect faces from the input image.
//  * See https://docs.opencv.org/master/d2/d99/tutorial_js_face_detection.html
//  * @param {cv.Mat} img Input image
//  * @returns the modified image with detected faces drawn on it.
//  */
// export function detectHaarFace(img) {
//   // const newImg = img.clone();
//   const newImg = img;

//   const gray = new cv.Mat();
//   cv.cvtColor(newImg, gray, cv.COLOR_RGBA2GRAY, 0);

//   const faces = new cv.RectVector();

//   // detect faces
//   faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
//   for (let i = 0; i < faces.size(); ++i) {
//     const point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
//     const point2 = new cv.Point(
//       faces.get(i).x + faces.get(i).width,
//       faces.get(i).y + faces.get(i).height
//     );
//     cv.rectangle(newImg, point1, point2, [255, 0, 0, 255]);
//   }

//   gray.delete();
//   faces.delete();

//   return newImg;
// }
