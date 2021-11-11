import "./App.css";
// import { OpenCvProvider } from "opencv-react";
import RouterMap from "./router/routerMap";
import io from 'socket.io-client';

export const socket = io('http://localhost:5000/');

export default function App() {
  socket.on("connect", () => {
    console.log(socket.id);
  });
  
  socket.on("disconnect", () => {
    console.log(socket.id);
  });
  return (
    <div className="App">
      {/* <OpenCvProvider onLoad={onLoaded} openCvPath="/opencv/opencv.js"> */}
        <RouterMap />
      {/* </OpenCvProvider> */}
    </div>
  );
}

// export default App;
