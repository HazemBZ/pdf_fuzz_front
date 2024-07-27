export const projectName = "PDF FUZZ";
export const targetServer = process.env.REACT_APP_BACKEND.replace(":", "")
  ? process.env.REACT_APP_BACKEND
  : "localhost:8000";
