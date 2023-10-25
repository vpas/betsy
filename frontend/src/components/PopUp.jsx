import React from "react";

import "./PopUp.css";
import Button from "./Button";

export const PopUp = ({ message, onOk, onBack, isVisible }) => {
  const hiddenClass = isVisible ? "" : "pop-up-hidden";
  return (
    <div className={"pop-up-wrapper " + hiddenClass}>
      <div className="pop-up-window">
        <div className="pop-up-message body1">{message}</div>
        <div className="pop-up-buttons">
          <Button
            text="OK"
            className="button-ok"
            onClick={onOk}
          />
          <Button
            text="BACK"
            className="button-back secondary-action"
            onClick={onBack}
          />
        </div>
      </div>
    </div>
  );
};

export default PopUp;