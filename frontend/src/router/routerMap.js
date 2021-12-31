import {
    Route,
    Switch,
    BrowserRouter,
} from "react-router-dom";
import React from "react";
import RouterList from "../router/routerList";
import Welcome from "../pages/Welcome";
import SignupStudent from "../pages/Signup_student";
import SignupTeacher from "../pages/Signup_teacher";
import StudentHome from "../pages/Student_home";
import TeacherHome from "../pages/Teacher_home";
import AdminHome from "../pages/Admin_home";
import UserManagement from "../pages/User_management";
import TeacherClassroom from "../pages/Teacher_classroom";
import TeacherInfo from "../pages/Teacher_info";
import StudentInfo from "../pages/Student_info";
import Attendance from "../pages/Attendance.jsx";
import Monitor from "../pages/Monitor";
import StatisticAdmin from "../pages/Statistic_admin";
import StatisticTeacher from "../pages/Statistic_teacher";
import SettingMode from "../pages/Setting_mode.jsx";
import NotFound from "../pages/NotFound";
  
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
          <Route exact path={RouterList.MONITOR} component={Monitor} />
          <Route exact path={RouterList.ADMIN_HOME} component={AdminHome} />
          <Route exact path={RouterList.ADMIN_USER_MANAGEMENT} component={UserManagement} />
          <Route exact path={RouterList.ADMIN_STATISTIC} component={StatisticAdmin} />
          <Route exact path={RouterList.TEACHER_STATISTIC} component={StatisticTeacher} />
          <Route exact path={RouterList.SETTING_MODE} component={SettingMode} />
          {/* <Route exact path={RouterList.ATTENDANCE} component={() => (<Attendance socket="value" />)} /> */}
          {/* <Route match = {false} component={() => <Redirect to={RouterList.WELCOME}/>} /> */}
          <Route component={NotFound}/>
        </Switch>
      </BrowserRouter>
    );
}
  