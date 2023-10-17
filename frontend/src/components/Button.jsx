import React from "react";
import "./Button.css";

export const Button = ({ text, className, onClick, style, disabled = false }) => {
  const disabledClass = disabled ? " disabled" : "";
  return (
    <div
      className={"button-wrapper " + className + disabledClass}
      onClick={disabled ? null : onClick}
      style={style}
    >
      <div className={"button" + disabledClass}>{text}</div>
    </div>
  );
};

export default Button;