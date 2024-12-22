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
          headerText="선착순 쿠폰"
          discount="에버랜드 자유이용권"
          subText="미션 인증 완료시 100% 지급"
          quantity="남은 수량 : 1000장"
          buttons={[
            {
              className: "offline-button",
              text: "선착순 쿠폰 받기 ↓",
              onClick: () => alert("오프라인 선착순 쿠폰 받기"),
            },
          ]}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Events;
