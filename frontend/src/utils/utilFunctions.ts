import { toast } from "react-toastify";
import { PythonError } from "../types";

export const getObjectPath = (key: string) =>
  `http://localhost:9000/waitmanagement/${key}`;

export const raiseNotification = (message: string | JSX.Element) => {
  toast(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const raiseError = (message: string | JSX.Element) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const handleApiCall = async (
  cb: () => Promise<void>,
  successMsg: string
) => {
  try {
    await cb();
    raiseNotification(successMsg);
  } catch (error: unknown) {
    toast.error((error as PythonError).data.detail, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
};
