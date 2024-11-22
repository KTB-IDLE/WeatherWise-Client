import React from "react";
import { useLocation } from "react-router-dom";
import SuccessComment from "../components/SuccessComment";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import SuccessInfo from "../components/SuccessInfo";
import { useNavigate } from "react-router-dom";

const MissionSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // location.state로부터 동적으로 넘어온 데이터
  const { missionExp, userLevel, userExp, userLevelMaxExp } =
    location.state || {};

  return (
    <div className="mission-success-page">
      {/* 헤더 */}
      <Header
        leftChild={<Button text={<img src={left} alt="Back" />} type="icon" />}
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

      <SuccessComment />

      {/* SuccessInfo에 필요한 데이터를 전달 */}
      <SuccessInfo
        missionExp={missionExp}
        userLevel={userLevel}
        userExp={userExp}
        userLevelMaxExp={100 - userExp}
      />

      <Footer />
    </div>
  );
};

export default MissionSuccess;
