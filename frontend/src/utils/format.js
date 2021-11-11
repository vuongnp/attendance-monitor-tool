export function formatTime(date) {
  const time = new Date(date);
  return (
    time.getHours().toString().padStart(2, "0") +
    ":" +
    time.getMinutes().toString().padStart(2, "0") +
    ":" +
    time.getSeconds().toString().padStart(2, "0") +
    " " +
    time.getDate() +
    "/" +
    parseInt(time.getMonth() + 1) +
    "/" +
    time.getFullYear()
  );
};

export function formatHoursMinus(timestamp) {
  const time = new Date(timestamp);
  return (
    time.getHours().toString().padStart(2, "0") +
    ":" +
    time.getMinutes().toString().padStart(2, "0")
  );
};

export function formatDate(timestamp) {
  const time = new Date(timestamp);
  return (
    time.getDate() +
    "-" +
    parseInt(time.getMonth() + 1) +
    "-" +
    time.getFullYear()
  );
}
