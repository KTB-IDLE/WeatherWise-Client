import React from "react";
import "../pages/Events.css";

const Coupon = ({
  headerClass,
  headerText,
  name,
  id,
  condition,
  buttons,
  quantity,
}) => {
  return (
    <div className="event-card">
      <div className={`event-header ${headerClass}`}>{headerText}</div>
      <div className="event-content">
        <p className="event-discount">{name}</p>
        <p className="event-subtext">{condition}</p>
        <p className="event-subtext">{quantity}</p>
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
