import React from "react";
import "../pages/Events.css";
const MyCoupon = ({
  headerClass,
  name,
  disCountValue,
  expirationDate,
  used,
  onClick,
}) => {
  return (
    <div className="event-card">
      <div className={`event-header ${headerClass}`}>
        {used ? "사용 완료 쿠폰" : "사용 가능 쿠폰"}
      </div>
      <div className="event-content">
        <p className="event-discount">{name}</p>
        <p className="event-subtext">할인율: {disCountValue}%</p>
        <p className="event-subtext">
          만료일: {new Date(expirationDate).toLocaleDateString()}
        </p>
        <p className={`event-status ${used ? "used" : "available"}`}>
          {used ? "이미 사용한 쿠폰입니다." : "사용 가능한 쿠폰입니다."}
        </p>
        <button className="event-button" onClick={onClick} disabled={used}>
          {used ? "사용 완료" : "사용하기"}
        </button>
      </div>
    </div>
  );
};

export default MyCoupon;
