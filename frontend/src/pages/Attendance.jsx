import { InferenceSession } from "onnxruntime-web";
import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import axios from "axios";
import ndarray from "ndarray";
import { Button } from "react-bootstrap";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

import {
  processImgFromCanvas,
  nms,
  drawAfterDetect,
} from "../utils/faceDetect";
import { processImgVectorizeFromCanvas, cosinesim } from "../utils/vectorize";
import config from "../config/config";
import Header from "../components/header";
import {formatTime} from "../utils/format";
import ModelDetect from "../models/face-detect-RFB.onnx";
import ModelVectorize from "../models/mobilefacenet_vgg2.onnx";
import {socket} from "../App";
import "./Attendance.css";

let inferenceSession;
let inferenceSessionVec;
// const IMAGE_SIZE = 640;
const CAM_WIDTH = 640;
const CAM_HEIGHT = 480;
let stu_embedding;
let start_time;
const student_id = localStorage.getItem("student_id");
let class_id;
let count = 0;
let loading = 0;

const loadModel = async () => {
  inferenceSession = await InferenceSession.create(ModelDetect);
  console.log("Model detect loaded");
  inferenceSessionVec = await InferenceSession.create(ModelVectorize);
  console.log("Model vectorize loaded");
};
const getEmbeddingDatabase = async () => {
  console.log("Loading embedding");
  await axios
    .get(`${config.SERVER_URI}/user/userinfo/${student_id}`)
    .then((response) => {
      if (response) {
        stu_embedding = response.data.data.embedding;
        console.log("Embedding loaded");
      }
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
};
const getStartTime = async () => {
	console.log("Loading start time");
	class_id= window.location.pathname.split('/')[2];
	await axios
	  .get(`${config.SERVER_URI}/student/getinfoclass/${class_id}`)
	  .then((response) => {
		  // console.log(response);
		if (response) {
		  start_time = response.data.data.start_time;
		  console.log("Start time loaded");
		}
	  })
	  .catch((error) => {
		console.error("There was an error!", error);
	  });
  };

function Attendance(props) {
	// const class_id = window.location.pathname.split('/')[2];
//   const class_id = props.match.params.id;
  const [errorManyFace, setErrorManyFace] = useState(false);
  const [errorNonFace, setErrorNonFace] = useState(false);
  const [lengthLoading, setLengthLoading] = useState(0);
  const [success, setSuccess] = useState(false);
  const [notSuccess, setNotSuccess] = useState(false);
  const [startTime, setStartTime] = useState("");

  const video = useRef();
  const canvas = useRef();
  const destination = useRef();

  const gotoLearning = () => {
    alert("Go to learn");
  };
  const renderCanvas = useCallback(async () => {
    const ctx = canvas.current.getContext("2d");
    const ctx_dest = destination.current.getContext("2d");
    ctx_dest.drawImage(canvas.current, 0, 0, CAM_WIDTH, CAM_HEIGHT);
    if (count % 5 === 0 && count < 100 && loading < 10) {
      canvas.current.width = CAM_WIDTH;
      canvas.current.height = CAM_HEIGHT;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(video.current, 0, 0, CAM_WIDTH, CAM_HEIGHT);

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
      let dets = nms(CAM_WIDTH, CAM_HEIGHT, confs, locs, 0.5, 0.4);

      if (dets.length > 1) {
        setErrorManyFace(true);
        setErrorNonFace(false);
      } else if (dets.length === 1) {
			setErrorManyFace(false);
			setErrorNonFace(false);

			drawAfterDetect("dstCanvas", dets[0]);
			const onnxTensorVec = await processImgVectorizeFromCanvas(
			dets[0],
			canvas.current
			);
			const result = await inferenceSessionVec.run({ data: onnxTensorVec });
			const embedding = result.reid_embedding;
			const embeddingTensor = ndarray(new Float32Array(embedding.data), [
			1,
			embedding.dims[1],
			]);
			let embeddingArr = new Float32Array(256);
			for (var i = 0; i < 256; ++i) {
				embeddingArr[i] = embeddingTensor.get(0, i);
			}
			let stu_embeddingArr = new Float32Array(256);
			for (var i = 0; i < 256; ++i) {
				stu_embeddingArr[i] = stu_embedding[i] / 10000000000;
			}
			const sim_score = cosinesim(embeddingArr, stu_embeddingArr);
			console.log(sim_score);
			if (sim_score >= 0.8) {
				loading++;
			}
			console.log(loading);
			if (loading === 1) {
				setLengthLoading(10);
			} else if (loading === 2) {
				setLengthLoading(20);
			} else if (loading === 3) {
				setLengthLoading(30);
			} else if (loading === 4) {
				setLengthLoading(40);
			} else if (loading === 5) {
				setLengthLoading(50);
			} else if (loading === 6) {
				setLengthLoading(60);
			} else if (loading === 7) {
				setLengthLoading(70);
			} else if (loading === 8) {
				setLengthLoading(80);
			} else if (loading === 9) {
				setLengthLoading(90);
			} else if (loading === 10) {
				let attendance_time = new Date().getTime();
				setStartTime(formatTime(attendance_time));
				setLengthLoading(100);
				setSuccess(true);
				setNotSuccess(false);
				let time_delta = parseInt((parseInt(attendance_time)- parseInt(start_time))/60000);
        console.log(time_delta);
        if(time_delta>5){
          socket.emit('attendanced', {'data' : 
          {'student_username': localStorage.getItem('student_username'), 
          'class_id': class_id, 
          'time_delta': time_delta,
          'timestamp': parseInt(attendance_time)}
          });
        }
        
			}
      } else {
        setErrorNonFace(true);
        setErrorManyFace(false);
        //   return;
      }
    } else {
      if (loading !== 10 && count > 100) {
        setSuccess(false);
        setNotSuccess(true);
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
      await getStartTime();
      renderCanvas();
    };
    init();
  }, []);

  return (
    <div className="attendance-container">
      <Header name={localStorage.getItem("student_name")} home="student_home" />
      <div className="main-attendance">
        <div className="left-main-attendance">
          <video
            // style={{ display: "none" }}
            id="webcam"
            ref={video}
            width="0px"
            height="0px"
          />
          <canvas
            id="srcCanvas"
            ref={canvas}
            width={CAM_WIDTH}
            height={CAM_HEIGHT}
            style={{ display: "none" }}
          />
          <canvas
            id="dstCanvas"
            ref={destination}
            width={CAM_WIDTH}
            height={CAM_HEIGHT}
          />
          {/* <Button onClick={showOffWebcam}>Stop</Button> */}
        </div>

        <div className="right-main-attendance">
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "40px",
            }}
          >
            Trạng thái
          </div>
          {errorManyFace && (
            <div
              className="text-error"
              style={{ textAlign: "center", fontSize: "20px" }}
            >
              Quá nhiều khuôn mặt trong khung hình
            </div>
          )}
          {errorNonFace && (
            <div
              className="text-error"
              style={{ textAlign: "center", fontSize: "20px" }}
            >
              Vui lòng nhìn thẳng vào camera
            </div>
          )}
          <div className="loading">
            <div>0% </div>
            <div className="loading-bar-container">
              <div
                className="loading-bar"
                style={{ height: "100%", width: `${lengthLoading}%` }}
              ></div>
            </div>
            <div> 100%</div>
          </div>
          {success && (
            <div className="status">
              <div className="info-status">
                <div className="text-status">Hoàn thành</div>
                <DoneOutlineIcon style={{ color: "#28a745", fontSize: 30 }} />
              </div>
              <div style={{fontSize: "18px",color: "#423c3c"}}>Thời điểm {startTime}</div>
              <Button
                variant="outline-info"
                className="btn-status"
                onClick={gotoLearning}
              >
                Vào lớp học
              </Button>
            </div>
          )}
          {notSuccess && (
            <div className="status">
              <div className="info-status">
                <SentimentVeryDissatisfiedIcon
                  style={{ color: "#ff8f00", fontSize: 30, marginRight: 5 }}
                />
                <div className="text-status">Thất bại!!</div>
                {/* <SentimentVeryDissatisfiedIcon
                  style={{ color: "#ff8f00", fontSize: 30 }}
                /> */}
              </div>
              <Button
                variant="outline-info"
                className="btn-status"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Thử lại
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Attendance;