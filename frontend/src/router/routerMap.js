import {
    Redirect,
    Route,
    Switch,
    withRouter,
    Router,
    BrowserRouter,
} from "react-router-dom";
import React from "react";
import RouterList from "../router/routerList";
import Welcome from "../pages/Welcome";
import SignupStudent from "../pages/Signup_student";
import SignupTeacher from "../pages/Signup_teacher";
import StudentHome from "../pages/Student_home";
import TeacherHome from "../pages/Teacher_home";
import TeacherClassroom from "../pages/Teacher_classroom";
import TeacherInfo from "../pages/Teacher_info";
import StudentInfo from "../pages/Student_info";
import Attendance from "../pages/Attendance.jsx";
  
export default function RouterMap() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path={RouterList.WELCOME} component={Welcome} />
          <Route exact path={RouterList.SIGNUP_STUDENT} component={SignupStudent} />
          <Route exact path={RouterList.SIGNUP_TEACHER} component={SignupTeacher} />
          <Route exact path={RouterList.STUDENT_HOME} component={StudentHome} />
          <Route exact path={RouterList.TEACHER_HOME} component={TeacherHome} />
          <Route exact path={RouterList.TEACHER_CLASS} component={TeacherClassroom} />
          <Route exact path={RouterList.TEACHER_INFO} component={TeacherInfo} />
          <Route exact path={RouterList.STUDENT_INFO} component={StudentInfo} />
          <Route exact path={RouterList.ATTENDANCE} component={Attendance} />
          {/* <Route match = {false} component={() => <Redirect to={RouterList.WELCOME}/>} /> */}
        </Switch>
      </BrowserRouter>
    );
}
  