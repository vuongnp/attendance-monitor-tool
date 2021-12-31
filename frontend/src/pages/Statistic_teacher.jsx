import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config/config";
import { Bar, Doughnut } from "react-chartjs-2";
import Header from "../components/header";
import LoadingImg from "../assert/loading.gif";
import "./Statistic.css";

export default function StatisticTeacher() {
    const teacher_id = localStorage.getItem("teacher_id");
    const teacher_name = localStorage.getItem("teacher_name");
  const [classStat, setClassStat] = useState({
    labels: [],
    stats: [],
  });
  const [topClassFaultStat, setTopClassFaultStat] = useState({
    labels: [],
    stats: [],
  });
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    setShowLoading(true);
    axios
      .get(`${config.SERVER_URI}/teacher_statistic/${teacher_id}`)
      .then((response) => {
        setShowLoading(false);
        console.log(response);
        if (response) {
          setClassStat(response.data.data.class_stat);
          setTopClassFaultStat(response.data.data.top_class_fault);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const classStatData = {
    labels: [...classStat.labels],
    datasets: [
      {
        label: "Số lượng lớp",
        data: classStat.stats,
        backgroundColor: [
          // "#66cc00",
          // "#00cc66",
          // "#00cc99",
          // "#cc0000",
          // // "#cc6600",
          // "#cccc00",
          "#adc2eb",
          "#5c85d6",
          "#85a3e0"
        ],
        borderWidth: 2,
      },
    ],
    responsive: true,
    maintainAspectRatio: false,
  };

  const topClassFaultStatData = {
    labels: [...topClassFaultStat.labels],
    datasets: [
      {
        label: "Số lượng vi phạm",
        backgroundColor: ["#8e5ea2"],
        data: topClassFaultStat.stats,
      },
    ],
  };

  return (
    <div className="stat-container">
      {showLoading && <img src={LoadingImg} alt="loading" className="loading-img"></img>}
      <Header home="teacher_home" name={teacher_name} />
      <div className="main-teacher-stat-container">
        <h3 style={{ color: "black", marginTop: "100px", textAlign: "center" }}>
          Top những lớp có nhiều vi phạm
        </h3>
        <Bar data={topClassFaultStatData} />

        <h3 style={{ color: "black", marginTop: "50px", textAlign: "center" }}>
          Thống kê số lượng lớp học theo thể loại
        </h3>
        <Doughnut data={classStatData} />
      </div>
    </div>
  );
}
