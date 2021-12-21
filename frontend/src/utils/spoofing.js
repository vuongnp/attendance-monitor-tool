import ndarray from "ndarray";
import ops from "ndarray-ops";
import { Tensor } from "onnxjs";
import cv from "@techstark/opencv-js";
const target_size = 80;
let dsize = new cv.Size(target_size, target_size);

function get_new_box(src_w, src_h, bbox, s) {
    let x = bbox[0];
    let y = bbox[1];
    let box_w = bbox[2] - x;
    let box_h = bbox[3] - y;

    let scale = Math.min((src_h-1)/box_h, Math.min((src_w-1)/box_w, s));

    let new_width = box_w * scale;
    let new_height = box_h * scale;
    let center_x = box_w/2+x;
    let center_y = box_h/2+y;

    let left_top_x = center_x-new_width/2;
    let left_top_y = center_y-new_height/2;
    let right_bottom_x = center_x+new_width/2;
    let right_bottom_y = center_y+new_height/2;

    let newbox=[];

    if (left_top_x < 0){
        right_bottom_x -= left_top_x;
        left_top_x = 0;
    }
    newbox.push(parseInt(left_top_x));
    if (left_top_y < 0){
        right_bottom_y -= left_top_y;
        left_top_y = 0;
    }
    newbox.push(parseInt(left_top_y));
    if (right_bottom_x > src_w-1){
        left_top_x -= right_bottom_x-src_w+1;
        right_bottom_x = src_w-1;
    }
    newbox.push(parseInt(right_bottom_x+1));
    if (right_bottom_y > src_h-1){
        left_top_y -= right_bottom_y-src_h+1;
        right_bottom_y = src_h-1;
    }
    newbox.push(parseInt(right_bottom_y+1));
    return newbox;
    
}
export function processImgAntiFromCanvas(det, imgSrc, width, height, scale=2.7){
    // var imgSrc = document.getElementById(canvasIdSrc);
    var ctx = imgSrc.getContext("2d");
    let newbox = get_new_box(width, height, det[1], scale);
    let xmin = newbox[0];
    let ymin = newbox[1];
    let xmax = newbox[2];
    let ymax = newbox[3];
    const imageData = ctx.getImageData(xmin, ymin, xmax-xmin, ymax-ymin);
    let src = cv.matFromImageData(imageData);
    let img = new cv.Mat();
    let image = new cv.Mat();
    cv.cvtColor(src, img, cv.COLOR_BGR2RGBA, 0);
    cv.resize(img, image, dsize, 0, 0);
    let arr = [];
    if (src.isContinuous()) {
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
    const tensor = new Tensor(
        new Float32Array(3 * target_size * target_size),
        "float32",
        [1, 3, target_size, target_size]
    );
    tensor.data.set(dataProcessedTensor.data);
    src.delete();
    img.delete();
    image.delete();
    return tensor;
}