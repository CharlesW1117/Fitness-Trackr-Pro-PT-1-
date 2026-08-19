import React from "react";
import "./Dashboard.css"; // reuse theme colors

const Toast = ({ message, type }) => {
  return <div className={`toast toast-${type}`}>{message}</div>;
};

export default Toast;
