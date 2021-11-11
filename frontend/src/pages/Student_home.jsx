import React, { useState, useEffect } from "react";
import {Button, FormControl } from "react-bootstrap";
// import { Link, useHistory } from "react-router-dom";
import SearchBar from "material-ui-search-bar";
import axios from "axios";
import config from "../config/config";
// import RouterList from "../router/routerList";
import Header from "../components/header";
import GridClassStudent from "../components/GridClassStudent";
import "./Student_home.css";

export default function StudentHome() {
  const student_username = localStorage.getItem("student_username");
  const [name, setName] = useState("User");
  const [classes, setClasses] = useState([]);
  const [oriClasses, setOriClasses] = useState([]);
  const [textSeach, setTextSearch] = useState("");
  // const [datahome, setDatahome] = useState({
  //   name: "User",
  //   classes: [],
  // });
  const [itemJoinClass, setItemJoinClass] = useState({
    student_id: localStorage.getItem("student_id"),
    code: "",
  })
  const [showErrorCode, setShowErrorCode] = useState(false);

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
  const refreshPage = () => {
    window.location.reload();
  };
  const handleChangeCodeJoin = (e) => {
    itemJoinClass.code = e.target.value;
    setItemJoinClass({ ...itemJoinClass });
  };
  const handleJoinClass = () =>{
    axios
    .post(`${config.SERVER_URI}/student/joinclass`, itemJoinClass)
    .then((response) => {
      console.log(response);
      if (response.data.code === "9999") {
        setShowErrorCode(true);
      }else{
        setShowErrorCode(false);
        refreshPage();
      }
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
  }
  useEffect(() => {
    axios
      .get(`${config.SERVER_URI}/student_home_data/${student_username}`)
      .then((response) => {
        console.log(response);
        if (response) {
          // setDatahome(response.data.data);
          setName(response.data.data.name);
          setClasses(response.data.data.classes);
          setOriClasses(response.data.data.classes);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, [student_username]);

  return (
    <div id="student-container">
      {/* {datahome && <Header name={datahome.name} home="student_home" />} */}
      {name && <Header name={name} home="student_home" />}
      <div className="main-container">
        <div className="top-container">
          <div className="join-class">
            <FormControl
              className="input-join"
              placeholder="Mã lớp"
              value={itemJoinClass.code}
              onChange={handleChangeCodeJoin}
            />
            <Button
              variant="info"
              type="submit"
              className=""
              onClick={handleJoinClass}
            >
              Tham gia
            </Button>
            {showErrorCode && (
              <div className="text-error" style={{"marginLeft": "5px", "lineHeight":"50px"}}>
                Không tìm thấy mã lớp
              </div>
            )}
          </div>

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
        {/* {datahome && <GridClassStudent classes={datahome.classes} />} */}
        {classes && <GridClassStudent classes={classes} />}
      </div>
    </div>
  );
}
