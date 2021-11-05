import React from "react";
import Webcam from "react-webcam";
import cv from "@techstark/opencv-js";
import { loadHaarFaceModels, detectHaarFace } from "./haarFaceDetection";
import "./styles.css";

export default function App() {
  const [modelLoaded, setModelLoaded] = React.useState(false);

  React.useEffect(() => {
    loadHaarFaceModels().then(() => {
      setModelLoaded(true);
    });
  }, []);

  const webcamRef = React.useRef(null);
  const imgRef = React.useRef(null);
  const faceImgRef = React.useRef(null);

  React.useEffect(() => {
    if (!modelLoaded) return;

    const detectFace = async () => {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      return new Promise((resolve) => {
        imgRef.current.src = imageSrc;
        imgRef.current.onload = () => {
          try {
            const img = cv.imread(imgRef.current);
            detectHaarFace(img);
            cv.imshow(faceImgRef.current, img);

            img.delete();
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

  return (
    <div className="App">
      <h2>Real-time Face Detection</h2>
      <Webcam
        ref={webcamRef}
        className="webcam"
        mirrored
        screenshotFormat="image/jpeg"
      />
      <img className="inputImage" alt="input" ref={imgRef} />
      <canvas className="outputImage" ref={faceImgRef} />
      {!modelLoaded && <div>Loading Haar-cascade face model...</div>}
    </div>
  );
}
