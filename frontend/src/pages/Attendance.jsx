import { InferenceSession } from "onnxruntime-web";
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import axios from "axios";
import ndarray from "ndarray";
// import ops from "ndarray-ops";

import {
  processImgFromCanvas,
  nms,
  drawAfterDetect
} from "../utils/faceDetect";
import {
	processImgVectorizeFromCanvas,
	cosinesim
} from "../utils/vectorize";

import ModelDetect from "../models/face-detect-RFB.onnx";
import ModelVectorize from "../models/mobilefacenet_vgg2.onnx";
// import "./App.css";

let inferenceSession;
let inferenceSessionVec;
const IMAGE_SIZE = 640;
// const CAM_WIDTH = 640;
// const CAM_HEIGHT = 480;
let stu_embedding;
const student_id = localStorage.getItem("student_id");
// const res1 = [123, 234, 345, 456, 567, 789, 890];
// const res = [333, 444, 555, 111, 222, 222, 555];
let count = 0;

const loadModel = async () => {
  inferenceSession = await InferenceSession.create(ModelDetect);
  console.log("Model detect loaded");
  inferenceSessionVec = await InferenceSession.create(ModelVectorize);
  console.log("Model vectorize loaded");
//   const a = cosinesim(res1, res);
//   console.log(a);
};
const getEmbeddingDatabase = async()=>{
	console.log('Loading embedding');
	await axios
	.get(`http://localhost:5000/user/userinfo/${student_id}`)
	.then((response) => {
	//   console.log(response);
	  if (response) {
		// setStuEmbedding(response.data.data.embedding);
		stu_embedding = response.data.data.embedding;
		// console.log(stu_embedding.length);
		console.log('Embedding loaded');
	  }
	})
	.catch((error) => {
	  console.error("There was an error!", error);
	});
}
function Attendance(props) {
	const class_id = props.match.params.id;
	// const [stu_embedding, setStuEmbedding] = useState([]);

	const video = useRef();
	const canvas = useRef();
	const destination = useRef();
	const renderCanvas = useCallback(async () => {
		const ctx = canvas.current.getContext("2d");
		const ctx_dest = destination.current.getContext("2d");
		ctx_dest.drawImage(canvas.current, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
		if(count % 10 == 0){
			canvas.current.width = IMAGE_SIZE;
			canvas.current.height = IMAGE_SIZE;
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.drawImage(video.current, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
			// const onnxTensor = getTensorFromCanvasContext(ctx);
			// const onnxTensor = await canvasToTensor("srcCanvas");
			const onnxTensor = await processImgFromCanvas("srcCanvas");
			// console.log(onnxTensor.data);
			const prediction = await inferenceSession.run({ input: onnxTensor });
			// console.log(prediction);
			const scores = prediction.scores;
			const boxes = prediction.boxes;
			let numbers = boxes.dims[1];
			//convert tensor to js array
			const scoresTensor = ndarray(new Float32Array(scores.data), [numbers, 2]);
			const boxesTensor = ndarray(new Float32Array(boxes.data), [numbers, 4]);
			let locs = []; //location
			for (var i = 0; i < numbers; ++i) {
				var loc = new Float32Array(4);
				for (var j = 0; j < 4; ++j) {
					loc[j] = boxesTensor.get(i, j);
				}
				locs.push(loc);
			}
			let confs = new Float32Array(numbers); //confidences
			for (var i = 0; i < numbers; ++i) {
				confs[i] = scoresTensor.get(i, 1);
			}
			let dets = nms(IMAGE_SIZE, IMAGE_SIZE, confs, locs, 0.5, 0.4);
			// var ctx_dest = destination.current.getContext("2d");
			// ctx_dest.drawImage(canvas.current, 0, 0, IMAGE_SIZE, IMAGE_SIZE);
			for (var i = 0; i < dets.length; ++i) {
				drawAfterDetect("dstCanvas", dets[i]);
				const onnxTensorVec = await processImgVectorizeFromCanvas(dets[i], canvas.current);
				const result = await inferenceSessionVec.run({ data: onnxTensorVec });
				const embedding = result.reid_embedding;
				// console.log(embedding.data);
				const embeddingTensor = ndarray(new Float32Array(embedding.data), [1, embedding.dims[1]]);
				// console.log(embeddingTensor.data);
				// let embeddingArr = new Float32Array(embedding.dims[1]);
				let embeddingArr = new Float32Array(256);
				for (var i = 0; i < 256; ++i) {
					// console.log(embeddingTensor.get(0, i));
					embeddingArr[i]= embeddingTensor.get(0, i);
				}
				let stu_embeddingArr = new Float32Array(256);
				for (var i = 0; i < 256; ++i) {
					// console.log(embeddingTensor.get(0, i));
					stu_embeddingArr[i]=stu_embedding[i]/10000000000;
				}
				const sim_score = cosinesim(embeddingArr, stu_embeddingArr);
				console.log(sim_score);
			}
		}
		// drawAfterDetect("dstCanvas", dets);
		count = count + 1;
		setTimeout(renderCanvas, 100);
  }, [canvas]);

  const detectFrame = useCallback(() => {
    renderCanvas();
    // requestAnimationFrame(() => {
    // 	renderCanvas();
    // });
  }, [renderCanvas]);

  useLayoutEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
		  facingMode: "user",
		//   width: 640,
		//   height: 640
        },
      })
      .then((stream) => {
        video.current.srcObject = stream;
        video.current.onloadedmetadata = () => {
          video.current.play();
        };
      });
  }, [detectFrame, video]);

  useLayoutEffect(() => {
    const init = async () => {
	  await loadModel();
	  await getEmbeddingDatabase();
      renderCanvas();
    };
    init();
  }, []);

  return (
    <div className="Attendance">
      {/* <p>Modelllll</p> */}
      <video
        // style={{ display: "none" }}
        ref={video}
        width="0px"
        height="0px"
      />
      <canvas
        id="srcCanvas"
        ref={canvas}
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        style={{ display: "none" }}
      />
      <canvas
        id="dstCanvas"
        ref={destination}
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
      />
	  {/* <canvas
		id="srcCanvasVectorize"
		// width={IMAGE_SIZE}
        // height={IMAGE_SIZE}
        style={{ display: "none" }}
      /> */}
    </div>
	
  );
}

export default Attendance;
