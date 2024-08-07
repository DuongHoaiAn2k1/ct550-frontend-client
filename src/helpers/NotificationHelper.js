import { ElNotification } from "element-plus";

function showSuccess(message) {
  ElNotification({
    title: "Success",
    message: message,
    type: "success",
  });
}

function showWarning(message) {
  ElNotification({
    title: "Warning",
    message: message,
    type: "warning",
  });
}

export { showSuccess, showWarning };
