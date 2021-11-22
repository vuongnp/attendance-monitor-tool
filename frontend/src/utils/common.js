export function imgToServer(canvasId) {
    let imgElement = document.getElementById(canvasId);
    var data = imgElement.toDataURL("image/jpeg");
    return data;
    // var fileReader = new FileReader();
    // fileReader.readAsDataURL(img)
    // fileReader.onload = () => {
    //     var arrayBuffer = fileReader.result; 
    //     return arrayBuffer;
    //  }
    // var fileReader = new FileReader();
    // fileReader.readAsArrayBuffer(img); 
    // fileReader.onload = () => {
    //     var arrayBuffer = fileReader.result; 
    //     return arrayBuffer;
    //  }
  };