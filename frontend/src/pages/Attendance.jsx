import { InferenceSession } from "onnxruntime-web";
import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ndarray from "ndarray";
import { Modal, Button } from "react-bootstrap";
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
import LoadingImg from "../assert/loading.gif";
import { formatTime } from "../utils/format";
import { processImgToServer } from "../utils/common";
import ModelDetect from "../models/face-detect-RFB.onnx";
import ModelVectorize from "../models/mobilefacenet_vgg2.onnx";
import { socket } from "../App";
import "./Attendance.css";

let inferenceSession;
let inferenceSessionVec;

// const CAM_WIDTH = 640;
// const CAM_HEIGHT = 480;
const CAM_WIDTH = 800;
const CAM_HEIGHT = 640;
const TIME_TO_STOP = 30000; //30s
let stu_embedding;
let start_time;
let time_to_late;
let count_imgs_report = 0;
let arr_Imgs = [];
const student_id = localStorage.getItem("student_id");
let class_id;
let finished = false;
let loading = 0;
let class_mode;
let start_time_attendance;
let current_time_attendance;
let delta_time;
let timeout;
var localStream;

const loadModel = async () => {
  inferenceSession = await InferenceSession.create(ModelDetect);
  console.log("Model detect loaded");
  inferenceSessionVec = await InferenceSession.create(ModelVectorize);
  console.log("Model vectorize loaded");
};
const getAttendanceDatabase = async () => {
  console.log("Loading embedding and device");
  await axios
    .get(`${config.SERVER_URI}/user/userinfo/${student_id}`)
    .then((response) => {
      if (response) {
        stu_embedding = response.data.data.embedding;
        if(response.data.data.gpu===1){
          timeout = config.TIMEOUT_GPU;
        }else{
          timeout = config.TIMEOUT_CPU;
        }
        console.log("Embedding and device loaded");
      }
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
};
const getInfoAttendance = async () => {
  console.log("Loading Info Attendance");
  class_id = window.location.pathname.split("/")[2];
  await axios
    .get(`${config.SERVER_URI}/student/getinfoclass/${class_id}`)
    .then((response) => {
      // console.log(response);
      if (response) {
        start_time = response.data.data.start_time;
        time_to_late = response.data.data.time_to_late;
        class_mode = response.data.data.mode;
        console.log("Info Attendance loaded");
      }
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
};

function Attendance(props) {
  // const class_id = window.location.pathname.split('/')[2];
  //   const class_id = props.match.params.id;
  const history = useHistory();

  const [errorManyFace, setErrorManyFace] = useState(false);
  const [errorNonFace, setErrorNonFace] = useState(false);
  const [lengthLoading, setLengthLoading] = useState(0);
  const [success, setSuccess] = useState(false);
  const [notSuccess, setNotSuccess] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [clickedOpenCam, setClickedOpenCam] = useState(true);
  const [showRefuse, setShowRefuse] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [showReportedToTeacher, setShowReportedToTeacher] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const video = useRef();
  const canvas = useRef();
  const destination = useRef();

  const gotoLearning = (class_mode) => {
    if(class_mode==="0"){
      history.push("/student_home");
    }else{
      let linktoclass = "/monitor/" + class_id;
      history.push(linktoclass);
    }
  };
  const handleCloseModal = () => {
    setShowAccept(false);
    setShowRefuse(false);
    setShowReportedToTeacher(false);
  };

  const renderCanvas = useCallback(async () => {
    current_time_attendance= new Date().getTime();
    delta_time = current_time_attendance-start_time_attendance;
    // if (canvas.current) {
    if(!finished){
      const ctx = canvas.current.getContext("2d");
      const ctx_dest = destination.current.getContext("2d");
      // ctx_dest.drawImage(canvas.current, 0, 0, CAM_WIDTH, CAM_HEIGHT);
      // if (count % 5 === 0 && count < 100 && loading < 10) {
      if (delta_time<TIME_TO_STOP && loading < 10){
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
        const scoresTensor = ndarray(new Float32Array(scores.data), [
          numbers,
          2,
        ]);
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
        let dets = nms(CAM_WIDTH, CAM_HEIGHT, confs, locs, config.IOU_THRES, config.CONFIDENCE_THRES);
        ctx_dest.drawImage(canvas.current, 0, 0, CAM_WIDTH, CAM_HEIGHT);
        if (dets.length > 1) {
          drawAfterDetect("dstCanvas", dets);
          setErrorManyFace(true);
          setErrorNonFace(false);
        } else if (dets.length === 1) {
          setErrorManyFace(false);
          setErrorNonFace(false);

          drawAfterDetect("dstCanvas", dets);
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
            stu_embeddingArr[i] = parseFloat(stu_embedding[i]);
          }
          // console.log(stu_embeddingArr);
          // console.log(embeddingArr);
          const sim_score = cosinesim(embeddingArr, stu_embeddingArr);
          // console.log(sim_score);
          if (sim_score >= config.ATTENDANCE_THRES) {
            loading++;
          } else {
            if (count_imgs_report < 4) {
              arr_Imgs.push(processImgToServer("srcCanvas", current_time_attendance));
              // arr_Imgs.push(imgToServer("srcCanvas"));
              count_imgs_report++;
            }
          }
          // console.log(loading);
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
            finished=true;
            stopCamera();
            let attendance_time = new Date().getTime();
            setStartTime(formatTime(attendance_time));
            setLengthLoading(100);
            setSuccess(true);
            setNotSuccess(false);
            let time_late = parseInt(
              (parseInt(attendance_time) - parseInt(start_time)) / 60000
            );
            console.log(time_late);
            if (time_late > time_to_late) {
              socket.emit("attendanced_late", {
                data: {
                  student_id: localStorage.getItem("student_id"),
                  class_id: class_id,
                  time_late: time_late,
                  timestamp: parseInt(attendance_time),
                },
              });
            }else{
              socket.emit("attendanced_ontime", {
                data: {
                  student_id: localStorage.getItem("student_id"),
                  class_id: class_id,
                },
              });
            }
            setTimeout(() => {
              gotoLearning(class_mode);
          }, 5000);         
          }
        } else {
          console.log("noneface");
          setErrorNonFace(true);
          setErrorManyFace(false);
          //   return;
        }
      } else {
        if (delta_time>=TIME_TO_STOP) {
          finished=true;
          setSuccess(false);
          setNotSuccess(true);
          stopCamera();
        }
      }
      // console.log(count);
      // drawAfterDetect("dstCanvas", dets);
      // count = count + 1;
      setTimeout(renderCanvas, timeout);
    }
  }, [canvas]);

  const openCamera = () => {
    setClickedOpenCam(false);
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
        },
      })
      .then((stream) => {
        localStream = stream;
        video.current.srcObject = stream;
        video.current.onloadedmetadata = () => {
          video.current.play();
        };
      });
    start_time_attendance = new Date().getTime();
    renderCanvas();
  };
  const stopCamera = () => {
    localStream.getTracks().forEach((track) => track.stop());
  };
  const reportToTeacher = () => {
    // console.log(arr_Imgs);
    // socket.emit("report_attendance", {
    //   data: {
    //     student_id: localStorage.getItem("student_id"),
    //     student_username: localStorage.getItem("student_username"),
    //     student_avt: localStorage.getItem("student_avt"),
    //     student_name: localStorage.getItem("student_name"),
    //     class_id: class_id,
    //     imgs: arr_Imgs,
    //   },
    // });
    let attendance_time = new Date().getTime();
    let time_late = parseInt(
      (parseInt(attendance_time) - parseInt(start_time)) / 60000
    );
    socket.emit("report_attendance", {
      data :{
        student_id: localStorage.getItem("student_id"),
        student_username: localStorage.getItem("student_username"),
        student_avt: localStorage.getItem("student_avt"),
        student_name: localStorage.getItem("student_name"),
        class_id: class_id,
        imgs: arr_Imgs,
        time_late: time_late,
        time_to_late: time_to_late,
        timestamp: attendance_time
      },
    });
    // axios
    //   .post(`${config.SERVER_URI}/student/reportAttendance`, data)
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.error("There was an error!", error);
    //   });
    setShowReportedToTeacher(true);
  };
  const handleAccepted = () => {
    let attendance_time = new Date().getTime();
    let time_late = parseInt(
      (parseInt(attendance_time) - parseInt(start_time)) / 60000
    );
    if (time_late > time_to_late) {
      socket.emit("attendanced_late", {
        data: {
          student_id: localStorage.getItem("student_id"),
          class_id: class_id,
          time_late: time_late,
          timestamp: parseInt(attendance_time),
        },
      });
    }else{
      socket.emit("attendanced_ontime", {
        data: {
          student_id: localStorage.getItem("student_id"),
          class_id: class_id,
        },
      });
    }
    gotoLearning(class_mode);
    // let linktoclass = "/monitor/" + class_id;
    // history.push(linktoclass);
  };

  socket.on("attendance_refused", () => {
    setShowRefuse(true);
  });
  socket.on("attendance_accepted", () => {
    setShowAccept(true);
  });

  useLayoutEffect(() => {
    const init = async () => {
      setShowLoading(true);
      await getAttendanceDatabase();
      await loadModel();
      await getInfoAttendance();
      socket.emit("student_join", localStorage.getItem("student_id"));
      setShowLoading(false);
      // renderCanvas();
    };
    init();
  }, []);

  return (
    <div className="attendance-container">
      {showLoading && <img src={LoadingImg} alt="loading" className="loading-img"></img>}
      <Header name={localStorage.getItem("student_name")} home="student_home" />
      <div className="main-attendance">
        <div className="left-main-attendance">
          {clickedOpenCam && (
            <Button
              onClick={openCamera}
              variant="secondary"
              className="click-open-cam"
            >
              Bắt đầu
            </Button>
          )}

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
              <div style={{ fontSize: "18px", color: "#423c3c" }}>
                Thời điểm {startTime}
              </div>
              {/* <Button
                variant="outline-info"
                className="btn-status"
                onClick={gotoLearning}
              >
                Vào lớp học
              </Button> */}
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
              <Button
                variant="outline-info"
                className="btn-status"
                onClick={reportToTeacher}
                style={{ marginLeft: "15px" }}
              >
                Báo cáo lỗi
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Refused */}
      <Modal show={showRefuse} onHide={handleCloseModal}>
        <Modal.Body style={{ textAlign: "center" }}>
          <span style={{ fontSize: 24 }}>Không được chấp nhận!</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Accept */}
      <Modal show={showAccept} onHide={handleCloseModal}>
        <Modal.Body style={{ textAlign: "center" }}>
          <span style={{ fontSize: 24 }}>Điểm danh thành công!</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAccepted}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ReportedToTeacher */}
      <Modal show={showReportedToTeacher} onHide={handleCloseModal}>
        <Modal.Body style={{ textAlign: "center" }}>
          <span style={{ fontSize: 24 }}>Đã gửi báo cáo, chờ giáo viên xác nhận.</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Attendance;
