import ndarray from "ndarray";
import ops from "ndarray-ops";
import { Tensor } from "onnxjs";
import cv from "@techstark/opencv-js";
const target_size = 128;
let dsize = new cv.Size(target_size, target_size);

export function processImgVectorizeFromCanvas(det, imgSrc){
    // var imgSrc = document.getElementById(canvasIdSrc);
    var ctx = imgSrc.getContext("2d");
    let x = det[1][0];
    let y = det[1][1];
    let w = det[1][2]-x;
    let h = det[1][3]-y;
    const imageData = ctx.getImageData(x, y, w, h);
    let src = cv.matFromImageData(imageData);
    let img = new cv.Mat();
    cv.resize(src, img, dsize, 0, 0);
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
    const tensor = new Tensor(
        new Float32Array(3 * target_size * target_size),
        "float32",
        [1, 3, target_size, target_size]
    );
    tensor.data.set(dataProcessedTensor.data);
    img.delete();
    return tensor;
}

export function cosinesim(A,B){
    var dotproduct=0;
    var mA=0;
    var mB=0;
    // var dotproduct = new Float32Array(1);
    // var mA = new Float32Array(1);
    // var mB = new Float32Array(1);
    // var similarity = new Float32Array(1);
    for(var i = 0; i < A.length; i++){
        dotproduct += (A[i] * B[i]);
        mA += (A[i]*A[i]);
        mB += (B[i]*B[i]);
        // dotproduct[0] += (A[i] * B[i]);
        // mA[0] += (A[i]*A[i]);
        // mB[0] += (B[i]*B[i]);
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    var similarity = (dotproduct)/((mA)*(mB)) // here you needed extra brackets
    return similarity;
    // mA[0] = Math.sqrt(mA[0]);
    // mB[0] = Math.sqrt(mB[0]);
    // similarity[0] = (dotproduct[0])/((mA[0])*(mB[0]))
    // return similarity[0];
}