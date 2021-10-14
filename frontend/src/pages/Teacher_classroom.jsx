import React from "react";

export default function TeacherClassroom(props) {
    console.log(props);
  return (
    <div className="home-container">
      TeacherClassroom {props.match.params.id}
    </div>
  );
}
