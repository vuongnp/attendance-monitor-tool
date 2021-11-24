import ndarray from "ndarray";
import ops from "ndarray-ops";
import { Tensor } from "onnxjs";
import cv from "@techstark/opencv-js";
const target_size = 112;
let dsize = new cv.Size(target_size, target_size);

export function processImgHeadposeFromCanvas(det, imgSrc){
    // var imgSrc = document.getElementById(canvasIdSrc);
    var ctx = imgSrc.getContext("2d");
    let x = det[1][0];
    let y = det[1][1];
    let w = det[1][2]-x;
    let h = det[1][3]-y;
    const imageData = ctx.getImageData(x, y, w, h);
    let src = cv.matFromImageData(imageData);
    let img = new cv.Mat();
    let image = new cv.Mat();
    cv.cvtColor(src, img, cv.COLOR_BGR2RGBA, 0);
    cv.resize(img, image, dsize, 0, 0);
    let arr = [];
    if (image.isContinuous()) {
        arr = image.data;
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
    ops.divseq(dataProcessedTensor, 256);
    ops.subseq(dataProcessedTensor.pick(0, 1, null, null), 0.485);
    ops.subseq(dataProcessedTensor.pick(0, 2, null, null), 0.456);
    ops.subseq(dataProcessedTensor.pick(0, 0, null, null), 0.406);
    ops.divseq(dataProcessedTensor.pick(0, 1, null, null), 0.229);
    ops.divseq(dataProcessedTensor.pick(0, 2, null, null), 0.224);
    ops.divseq(dataProcessedTensor.pick(0, 0, null, null), 0.225);
    const tensor = new Tensor(
        new Float32Array(3 * target_size * target_size),
        "float32",
        [1, 3, target_size, target_size]
    );
    tensor.data.set(dataProcessedTensor.data);
    img.delete();
    image.delete();
    return tensor;
}

export function checkLookScreen(yaw,pitch){
    if(Math.abs(yaw) <=15 && Math.abs(pitch)<=15){
        return true;
    }else{
        return false;
    }
}
