import React from "react";
import { Button } from "react-bootstrap";
import DeleteIcon from "@material-ui/icons/Delete";
import "./OneTeacherClass.css";

export default function OneTeacherClass(props) {
  return (
      <div className="one-class-teacher">
        <div className="classname">{props.class.name}</div>
        <p>
          <span className="title-name">Mô tả: </span>
          {props.class.description}
        </p>
        <p>
          <span className="title-name">Mã lớp: </span>
          {props.class.code}
        </p>
        <p>
          <span className="title-name">Loại lớp: </span>
          {props.class.type}
        </p>
        <p>
          <span className="title-name">Lịch học: </span>
          {props.class.schedule}
        </p>
        <p>
          <span className="title-name">Thời lượng: </span>
          {props.class.duration} phút
        </p>
        <p>
          <span className="title-name">Số học sinh: </span>
          {props.class.students.length}
        </p>
        
        <div className="start-delete">
          <Button
            variant="success"
            type="submit"
            className=""
            //   onClick={handleSignin}
          >
            Bắt đầu học
          </Button>
          <Button
            variant="outlined"
            //   color="secondary"
            className=""
            size="small"
            // onClick={handleShowDelete}
          >
            <DeleteIcon style={{ color: "#dc3545", fontSize: 45 }} />
          </Button>
        </div>
      </div>
  );
}
