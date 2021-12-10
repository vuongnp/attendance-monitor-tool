import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
// import { Link, useHistory } from "react-router-dom";
import SearchBar from "material-ui-search-bar";
import axios from "axios";
import config from "../config/config";
// import RouterList from "../router/routerList";
import GridStudent from "../components/GridStudent";
import GridTeacher from "../components/GridTeacher";
import Header from "../components/header";
import LoadingImg from "../assert/loading.gif";
import "./Admin_home.css";

export default function UserManagement() {
  const admin_username = localStorage.getItem("admin_username");
  //   const [name, setName] = useState("User");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [oriTeachers, setOriTeachers] = useState([]);
  const [oriStudents, setOriStudents] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [textSeach, setTextSearch] = useState("");
  const handleSearch = () => {
    let teachersResult = [];
    let studentsResult = [];
    if (textSeach !== "") {
      for (var i = 0, c = oriTeachers.length; i < c; i++) {
        if (oriTeachers[i].name.toLowerCase().includes(textSeach.toLowerCase())) {
            teachersResult.push(oriTeachers[i]);
        }
        setTeachers(teachersResult);
      }
      for (var i = 0, c = oriStudents.length; i < c; i++) {
        if (oriStudents[i].name.toLowerCase().includes(textSeach.toLowerCase())) {
            studentsResult.push(oriStudents[i]);
        }
        setStudents(studentsResult);
      }
    } else {
        setTeachers(oriTeachers);
        setStudents(oriStudents);
    }
  };

  useEffect(() => {
    setShowLoading(true);
    axios
      .get(`${config.SERVER_URI}/admin_get_users`)
      .then((response) => {
        setShowLoading(false);
        console.log(response);
        if (response) {
            setTeachers(response.data.data.teachers);
            setOriTeachers(response.data.data.teachers);
            setStudents(response.data.data.students);
            setOriStudents(response.data.data.students);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, [admin_username]);

  return (
    <div id="admin-container">
      {showLoading && <img src={LoadingImg} alt="loading" className="loading-img"></img>}
      <Header home="admin_home" name="Quản lý đào tạo" />
      <div className="main-container">
        <Container>
          <div className="top-container">
            <SearchBar
              onChange={(text) => setTextSearch(text)}
              onRequestSearch={handleSearch}
              style={{
                //   margin: "0 auto",
                width: "50%",
                maxWidth: 800,
              }}
            />
          </div>
          {students && <GridStudent students={students} />}
          {teachers && <GridTeacher teachers={teachers} />}
        </Container>
      </div>
    </div>
  );
}
