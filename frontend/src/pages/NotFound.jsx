import React from "react";
import NotFoundImg from "../assert/404.jpg";

export default function NotFound() {

  return (
    <img src={NotFoundImg} alt="not found img" style={{width: "100vw", height:"100vh"}}></img>
  )
}
