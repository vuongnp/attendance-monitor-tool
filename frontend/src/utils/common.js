export function imgToServer(canvasId) {
    let imgElement = document.getElementById(canvasId);
    var data = imgElement.toDataURL("image/jpeg");
    return data;

  };

export function precessImgMonitorToServer(canvasId, timestamp){
  let type = "image/jpeg"
  let imgElement = document.getElementById(canvasId);
  var data = imgElement.toDataURL(type);
  data = data.replace('data:' + type + ';base64,', '');
  return {imgstring: data, timestamp: timestamp};
}