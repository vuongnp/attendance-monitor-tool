import { InferenceSession } from "onnxruntime-web";
import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ndarray from "ndarray";
import { Modal, Button } from "react-bootstrap";

import {
    processImgFromCanvas,
    nms,
    drawAfterDetect,
} from "../utils/faceDetect";
import {
    processImgHeadposeFromCanvas,
    checkLookScreen,
} from "../utils/headpose";
import { processImgVectorizeFromCanvas, cosinesim } from "../utils/vectorize";
import config from "../config/config";
import Header from "../components/header";
import LoadingImg from "../assert/loading.gif";
import { processImgToServer } from "../utils/common";
import ModelDetect from "../models/face-detect-RFB.onnx";
import ModelHeadpose from "../models/headpose_MobileNetv2_regression.onnx";
import ModelVectorize from "../models/mobilefacenet_vgg2.onnx";
import { socket } from "../App";
import "./Monitor.css";

let inferenceSession;
let inferenceSessionHeadpose;
let inferenceSessionVec;
// const IMAGE_SIZE = 640;
const CAM_WIDTH = 960;
const CAM_HEIGHT = 720;
let time_to_fault_monitor;
let stu_embedding;
const student_id = localStorage.getItem("student_id");
let class_id;
let count = 1;
let count_to_delete_fault = 0;
let arr_Imgs = [];
let start_time_to_save_img = start_time;
let start_time;
let delta_time;
let current_time;
let status = [true];
var localStream;
let finished = false;
let timeout;

const loadModel = async () => {
    inferenceSession = await InferenceSession.create(ModelDetect);
    // inferenceSession = await InferenceSession.create(ModelDetect, { executionProviders: ['webgl'] })
    console.log("Model detect loaded");
    inferenceSessionHeadpose = await InferenceSession.create(ModelHeadpose);
    // inferenceSessionHeadpose = await InferenceSession.create(ModelHeadpose, { executionProviders: ['webgl'] });
    console.log("Model headpose loaded");
    inferenceSessionVec = await InferenceSession.create(ModelVectorize);
    console.log("Model vectorize loaded");
};
const getEmbeddingAndDevice = async () => {
    console.log("Loading embedding and device");
    await axios
      .get(`${config.SERVER_URI}/user/userinfo/${student_id}`)
      .then((response) => {
        if (response) {
        console.log(response);
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
const getInfoMonitor = async () => {
    console.log("Loading Info Monitor");
    class_id = window.location.pathname.split("/")[2];
    await axios
        .get(`${config.SERVER_URI}/student/getinfoclass/${class_id}`)
        .then((response) => {
            // console.log(response);
            if (response) {
                time_to_fault_monitor =
                    response.data.data.time_to_fault_monitor * 60000;
                console.log("Info Monitor loaded");
            }
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });
};

function Monitor() {
    const history = useHistory();

    const [errorManyFace, setErrorManyFace] = useState(false);
    const [errorNonFace, setErrorNonFace] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [showLessonClosed, setShowLessonClosed] = useState(false);
    const [showCheckStayin, setShowCheckStayin] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    const video = useRef();
    const canvas = useRef();
    const destination = useRef();

    const handleCloseModal = () => {
        setShowNotification(false);
        setShowLessonClosed(false);
        setShowCheckStayin(false);
    };

    const renderCanvas = useCallback(async () => {
        try {
            // if (canvas.current) {
            if (!finished) {
                const ctx = canvas.current.getContext("2d");
                const ctx_dest = destination.current.getContext("2d");
                // ctx_dest.drawImage(canvas.current, 0, 0, CAM_WIDTH, CAM_HEIGHT)
                canvas.current.width = CAM_WIDTH;
                canvas.current.height = CAM_HEIGHT;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.drawImage(video.current, 0, 0, CAM_WIDTH, CAM_HEIGHT);

                const onnxTensor = await processImgFromCanvas("srcCanvas1");
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
                let dets = nms(CAM_WIDTH, CAM_HEIGHT, confs, locs, config.IOU_THRES, config.CONFIDENCE_THRES);
                current_time = new Date().getTime();
                ctx_dest.drawImage(canvas.current, 0, 0, CAM_WIDTH, CAM_HEIGHT);
                if (dets.length > 1) {
                    drawAfterDetect("dstCanvas1", dets);
                    status.push(false);
                    setErrorManyFace(true);
                    setErrorNonFace(false);
                } else if (dets.length === 1) {
                    setErrorManyFace(false);
                    setErrorNonFace(false);

                    drawAfterDetect("dstCanvas1", dets);
                    const onnxTensorHeadpose = await processImgHeadposeFromCanvas(
                        dets[0],
                        canvas.current
                    );
                    const result = await inferenceSessionHeadpose.run({
                        "input.1": onnxTensorHeadpose,
                    });
                    const angles = result["472"].data;
                    // console.log(angles.data);
                    if (!checkLookScreen(angles[0], angles[1])) {
                        status.push(false);
                        count_to_delete_fault = 0;
                        // console.log("not look");
                        if ((current_time - start_time_to_save_img) > 28000) {
                            arr_Imgs.push(processImgToServer("srcCanvas1", current_time));
                            start_time_to_save_img = current_time;
                        }
                    } else {
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
                            status.push(true);
                            if (status[count - 1] === true) {
                                count_to_delete_fault++;
                            }
                        } else {
                            status.push(false);
                            count_to_delete_fault = 0;
                            // console.log("not look");
                            if ((current_time - start_time_to_save_img) > 28000) {
                                arr_Imgs.push(processImgToServer("srcCanvas1", current_time));
                                start_time_to_save_img = current_time;
                            }
                        }

                        // console.log("look");
                    }
                } else {
                    console.log("nonface")
                    status.push(false);
                    setErrorNonFace(true);
                    setErrorManyFace(false);
                    //   return;
                }
                if (count_to_delete_fault >= 10) {
                    start_time = current_time;
                    count_to_delete_fault = 0;
                }
                // console.log("c",current_time);
                // console.log("s",start_time)
                // console.log(delta_time);
                // console.log("t", time_to_fault_monitor);
                delta_time = current_time - start_time;
                if (delta_time > time_to_fault_monitor) {
                    start_time = current_time;
                    socket.emit("posible_fault_monitor", {
                        data: {
                            student_id: student_id,
                            student_username: localStorage.getItem("student_username"),
                            student_name: localStorage.getItem("student_name"),
                            imgs: arr_Imgs,
                            class_id: class_id,
                            timestamp: current_time,
                        }
                    });
                    arr_Imgs = [];
                    setShowNotification(true);
                }
                // console.log("delta_time", delta_time / 60000);
                // console.log("count_to_delete_fault", count_to_delete_fault);
                count = count + 1;
                setTimeout(renderCanvas, timeout);
            }
        }catch (e){
            console.log("Have an error", e);
        }
        
    }, [canvas]);

    const detectFrame = useCallback(() => {
        renderCanvas();
        // requestAnimationFrame(() => {
        // 	renderCanvas();
        // });
    }, [renderCanvas]);

    const stopCamera = () => {
        localStream.getTracks().forEach((track) => track.stop());
    };
    const hanleOKLessonClosed = () => {
        setShowLessonClosed(false);
        history.push("/student_home");
    };
    const handleIStayIn = () => {
        let itemIstayin = {
            class_id: class_id,
            student_id: student_id
        }
        axios
            .post(`${config.SERVER_URI}/student/iStayIn`, itemIstayin)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
        setShowCheckStayin(false);
    };

    socket.on("lession_closed", () => {
        finished = true;
        stopCamera();
        setShowLessonClosed(true);
    });
    socket.on("are_you_stay_in", () => {
        setShowCheckStayin(true);
    });

    useLayoutEffect(() => {
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
    }, [detectFrame, video]);

    useLayoutEffect(() => {
        const init = async () => {
            setShowLoading(true);
            await getEmbeddingAndDevice();
            await loadModel();
            await getInfoMonitor();
            start_time = new Date().getTime();
            current_time = start_time;
            setShowLoading(false);
            socket.emit("student_join", student_id);
            renderCanvas();
        };
        init();
    }, []);

    return (
        <div className="monitor-container">
            {showLoading && <img src={LoadingImg} alt="loading" className="loading-img"></img>}
            <Header name={localStorage.getItem("student_name")} home="student_home" />
            <div className="main-monitor">
                {/* <Button onClick={stopCamera}>Stop Cam</Button> */}
                <video
                    // style={{ display: "none" }}
                    id="webcam1"
                    ref={video}
                    width={0}
                    height={0}
                />
                <canvas
                    id="srcCanvas1"
                    ref={canvas}
                    width={CAM_WIDTH}
                    height={CAM_HEIGHT}
                    style={{ display: "none" }}
                />
                <div className="show-cam">
                    <canvas
                        id="dstCanvas1"
                        ref={destination}
                        width={CAM_WIDTH}
                        height={CAM_HEIGHT}
                    />
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
            </div>

            {/* Notification */}
            <Modal show={showNotification} onHide={handleCloseModal}>
                <Modal.Body style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 24 }}>Cảnh báo vi phạm</p>
                    <p style={{ fontSize: 24 }}>Đã gửi thông báo đến giáo viên</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
          </Button>
                </Modal.Footer>
            </Modal>
            {/* Lession Closed */}
            <Modal show={showLessonClosed} onHide={handleCloseModal}>
                <Modal.Body style={{ textAlign: "center" }}>
                    <span style={{ fontSize: 24 }}>Tiết học đã kết thúc</span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={hanleOKLessonClosed}>
                        OK
          </Button>
                </Modal.Footer>
            </Modal>
            {/* Stay in */}
            <Modal show={showCheckStayin} onHide={handleCloseModal}>
                <Modal.Body style={{ textAlign: "center" }}>
                    <span style={{ fontSize: 24 }}>Bạn còn ở đó chứ?</span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleIStayIn}>
                        Tôi vẫn ở đây
          </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Monitor;
