import React from "react";
import "./OneNotification.css";
import { formatHoursMinus, formatDate } from "../utils/format";

export default function OneNotification(props) {
  const time = formatHoursMinus(props.item.timestamp);
  const date = formatDate(props.item.timestamp);
  return (
    <div className="one-noti-item">
      <div className="timestamp">
        <div className="time">{time}</div>
        <div className="date">{date}</div>
      </div>
      <div className="username">{props.item.student}</div>
      {props.item.time_delta && (
        <div className="message"> vào lớp muộn {props.item.time_delta} phút</div>
      )}
      {!props.item.time_delta && <div className="message"> không tập trung</div>}
    </div>
  );
}
