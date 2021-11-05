import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Col, Button, Row } from "react-bootstrap";
import Webcam from "react-webcam";
import cv from "@techstark/opencv-js";
import * as tf from "@tensorflow/tfjs";
import { Tensor, InferenceSession } from "onnxjs";
import {loadDetectModel, detectFaceRBF} from "../utils/detect";


export default function Attendance(props) {
  const session = new InferenceSession({ backendHint: "cpu" });
  const url = "../models/face-detect-RFB.onnx";
  
  const class_id = props.match.params.id;
  const [modelLoaded, setModelLoaded] = useState(false);

  // useEffect(() => {
  //   loadDetectModel().then(() => {
  //     setModelLoaded(true);
  //   });
  // }, []);

  const webcamRef = useRef(null);
  const imgRef = useRef(null);
  const faceImgRef = useRef(null);
  useEffect(() => {
    // if (!modelLoaded) return;
    async function loadModel() {
      try {
        await session.loadModel(url);
        setModelLoaded(true);
      } catch (error) {
        console.log(error);
      }
    }
    if (!modelLoaded){
      loadModel();
    }
    const detectFace = async () => {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      return new Promise((resolve) => {
        imgRef.current.src = imageSrc;
        imgRef.current.onload = () => {
          try {
            const img = cv.imread(imgRef.current);
            const tensor = detectFaceRBF(img);
            const outputMap = session.run([tensor]);
            console.log(outputMap);
            // cv.imshow(faceImgRef.current, img);

            // img.delete();
            resolve();
          } catch (error) {
            console.log(error);
            resolve();
          }
        };
      });
    };

    let handle;
    const nextTick = () => {
      handle = requestAnimationFrame(async () => {
        await detectFace();
        nextTick();
      });
    };
    nextTick();
    return () => {
      cancelAnimationFrame(handle);
    };
  }, [modelLoaded]);
  // useEffect(() => {
  //   const detectFace = async () => {
  //     const imageSrc = webcamRef.current.getScreenshot();
  //     if (!imageSrc) return;

  //     return new Promise((resolve) => {
  //       imgRef.current.src = imageSrc;
  //       imgRef.current.onload = () => {
  //         try {
  //           const org_img = cv.imread(imgRef.current);
  //           runModel(org_img);
  //           // let img = new cv.Mat();
  //           // let src = new cv.Mat();
  //           // // cv.cvtColor(org_img, src, cv.COLOR_BGR2RGB, 0);
  //           // cv.cvtColor(org_img, img, cv.COLOR_BGR2RGBA, 0);
  //           // const target_size = 640;
  //           // let dsize = new cv.Size(target_size, target_size);

  //           // // let src = new cv.Mat();
  //           // cv.resize(img, src, dsize, 0, 0);
  //           // let arr = [];
  //           // if (src.isContinuous()){
  //           //   arr = src.data;
  //           // }
  //           // const dataTensor = ndarray(new Float32Array(arr), [target_size, target_size, 4]);
  //           // const dataProcessedTensor = ndarray(new Float32Array(target_size * target_size * 3), [1, 3, target_size, target_size]);
  //           // ops.assign(dataProcessedTensor.pick(0, 0, null, null), dataTensor.pick(null, null, 2));
  //           // ops.assign(dataProcessedTensor.pick(0, 1, null, null), dataTensor.pick(null, null, 0));
  //           // ops.assign(dataProcessedTensor.pick(0, 2, null, null), dataTensor.pick(null, null, 1));
  //           // ops.subseq(dataProcessedTensor, 127);
  //           // ops.divseq(dataProcessedTensor, 128);
  //           // const tensor = new Tensor(new Float32Array(3 * target_size * target_size), 'float32', [1, 3, target_size, target_size]);
  //           // (tensor.data).set(dataProcessedTensor.data);
  //           // // console.log(tensor.data);
  //           // const outputMap = session.run([tensor]);
  //           // const outputTensor = outputMap.values().next().value;
  //           // console.log(outputTensor)
  //           // console.log(dataProcessedTensor.pick(null, null, 0));
  //           // const src = cv.imread(imgRef.current);
  //           // let rgbPlanes = new cv.MatVector();
  //           // cv.split(src, rgbPlanes);
  //           // let R = rgbPlanes.get(0);
  //           // let G = rgbPlanes.get(1);
  //           // let B = rgbPlanes.get(2);
  //           // console.log(R);
  //         //   console.log('image width: ' + src.cols + '\n' +
  //         // 'image height: ' + src.rows + '\n' +
  //         // 'image size: ' + src.size().width + '*' + src.size().height + '\n' +
  //         // 'image depth: ' + src.depth() + '\n' +
  //         // 'image channels ' + src.channels() + '\n' +
  //         // 'image type: ' + src.type() + '\n');
  //         // return;
  //           // let image = img.data;
  //           // const dataTensor = ndarray(new Float32Array(image), [target_size, target_size, 4]);
  //           // var red   = dataTensor.pick(null, null, 0);
  //         //   const dataProcessedTensor = ndarray(new Float32Array(target_size * target_size * 3), [1, 3, width, height]);
  //         //   let image = tf.tensor(img.data, [640, 640, 3]);
  //         //   const tensorData = image.dataSync();
  //           // cv.imshow(faceImgRef.current, img);
  //           // console.log(red);
  //           // img.delete();
  //           resolve();
  //         } catch (error) {
  //           console.log(error);
  //           resolve();
  //         }
  //       };
  //     });
  //   };

  //   let handle;
  //   const nextTick = () => {
  //     handle = requestAnimationFrame(async () => {
  //       await detectFace();
  //       nextTick();
  //     });
  //   };
  //   nextTick();
  //   return () => {
  //     cancelAnimationFrame(handle);
  //   };
  // }, [class_id]);

  return (
    <div className="WebCam">
      {!modelLoaded && <div>Loading face model...</div>}
      {/* <img
        id="imageSrc"
        src="http://res.cloudinary.com/vuongnp/image/upload/v1634825999/igrcplsnggfejlwl3ccx.jpg"
        alt="No Image"
      />
      <Button onClick={runModel}>Run</Button> */}
      <Webcam
        ref={webcamRef}
        className="webcam"
        mirrored
        screenshotFormat="image/jpeg"
        // hidden
        // width="100px"
        // height="100px"
      />
      <img className="inputImage" alt="input" ref={imgRef}/>
      <canvas className="outputImage" ref={faceImgRef} />
    </div>
  );
}
