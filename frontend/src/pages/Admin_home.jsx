import React, { useState, useEffect } from "react";
// import { Modal, Form, Col, Button } from "react-bootstrap";
// import { Link, useHistory } from "react-router-dom";
import SearchBar from "material-ui-search-bar";
import axios from "axios";
import config from "../config/config";
// import RouterList from "../router/routerList";
import Header from "../components/header";
import LoadingImg from "../assert/loading.gif";
import GridClassAdmin from "../components/GridClassAdmin";
import "./Admin_home.css";

export default function AdminHome() {
  const admin_username = localStorage.getItem("admin_username");
//   const [name, setName] = useState("User");
  const [classes, setClasses] = useState([]);
  const [oriClasses, setOriClasses] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [textSeach, setTextSearch] = useState("");
  const handleSearch = () => {
    let classesResult = [];
    if (textSeach !== "") {
      for (var i = 0, c = oriClasses.length; i < c; i++) {
        if (oriClasses[i].name.toLowerCase().includes(textSeach.toLowerCase())) {
          classesResult.push(oriClasses[i]);
        }
        setClasses(classesResult);
      }
    } else {
      setClasses(oriClasses);
    }
  };

//   const [showErrorParam, setShowErrorParam] = useState(false);

//   const refreshPage = () => {
//     window.location.reload();
//   };

  useEffect(() => {
    setShowLoading(true);
    axios
      .get(`${config.SERVER_URI}/admin_home_data`)
      .then((response) => {
        setShowLoading(false);
        console.log(response);
        if (response) {
          setClasses(response.data.data.classes);
          setOriClasses(response.data.data.classes);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, [admin_username]);

  return (
    <div id="admin-container">
      {showLoading && <img src={LoadingImg} alt="loading" className="loading-img"></img>}
      <Header home="admin_home" name="Quản lý đào tạo"/>
      <div className="main-container">
        <div className="top-container">
          <SearchBar
            onChange={(text) => setTextSearch(text)}
            onRequestSearch={handleSearch}
            style={{
              //   margin: "0 auto",
              width: "40%",
              maxWidth: 700,
            }}
          />
        </div>
        {/* {datahome && <GridClassTeacher classes={datahome.classes} />} */}
        {classes && <GridClassAdmin classes={classes} />}
      </div>
    </div>
  );
}
