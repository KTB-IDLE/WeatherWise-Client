import React from "react";
import Header from "../components/Header";
import Button from "../components/Button"; // Button 컴포넌트를 불러옴
import Footer from "../components/Footer";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import JoinForm from "../components/JoinForm";
import "./Join.css"; // CSS 파일 import
const Join = () => {
  return (
    <div className="join-page">
      <Header
        leftChild={
          <Button
            text={<img src={left} alt="Back" />}
            type="icon"
            onClick={() => console.log("Back button clicked")}
          />
        }
        title={<img src={mainLogo} alt="mainLogo" />}
      />

      <h1 className="join-title">Welcome to WeatherWise</h1>
      <JoinForm />
    </div>
  );
};

export default Join;
