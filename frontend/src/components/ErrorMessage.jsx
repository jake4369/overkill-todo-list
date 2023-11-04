import React from "react";

const ErrorMessage = ({ children, errorClass }) => {
  return <div className={`error-message ${errorClass}`}>{children}</div>;
};

export default ErrorMessage;
