import "./App.css";
// import { OpenCvProvider } from "opencv-react";
import RouterMap from "./router/routerMap";

function App() {
  // const onLoaded = (cv) => {
  //   console.log('opencv loaded, cv')
  // }
  return (
    <div className="App">
      {/* <OpenCvProvider onLoad={onLoaded} openCvPath="/opencv/opencv.js"> */}
        <RouterMap />
      {/* </OpenCvProvider> */}
    </div>
  );
}

export default App;
