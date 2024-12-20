import React from "react";
import "./Events.css";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Coupon from "../components/Coupon"; // Import the new Coupon component
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";

const Events = () => {
  return (
    <div>
      <Header
        title={<img src={mainLogo} alt="mainLogo" />}
        rightChild={
          <div>
            <Button
              text={<img src={info} alt="info" />}
              type="icon"
              onClick={() => navigate("/myprofile")}
            />
          </div>
        }
      />
      <div className="events-container">
        {/* Reusable Coupon Component for Offline */}
        <Coupon
          headerClass="offline-header"
          headerText="에버랜드 전용"
          discount="에버랜드 자유이용권"
          subText="미션 인증 완료시 100% 지급"
          buttons={[
            {
              className: "offline-button",
              text: "오프라인 선착순 쿠폰 받기 ↓",
              onClick: () => alert("오프라인 선착순 쿠폰 받기"),
            },
            {
              className: "offline-use-button",
              text: "오프라인 쿠폰 사용하기 →",
              onClick: () => alert("오프라인 쿠폰 사용하기"),
            },
          ]}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Events;
