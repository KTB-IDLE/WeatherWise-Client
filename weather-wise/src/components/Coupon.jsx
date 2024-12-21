import React from "react";
import "../pages/Events.css";

const Coupon = ({ headerClass, headerText, discount, subText, buttons }) => {
  return (
    <div className="event-card">
      <div className={`event-header ${headerClass}`}>{headerText}</div>
      <div className="event-content">
        <p className="event-discount">{discount}</p>
        <p className="event-subtext">{subText}</p>
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`event-button ${button.className}`}
            onClick={button.onClick}
          >
            {button.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Coupon;
