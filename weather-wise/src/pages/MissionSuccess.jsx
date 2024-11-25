import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import SuccessCommentEvent from "../components/SuccessCommentEvent";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import SuccessInfo from "../components/SuccessInfo";
import { useNavigate } from "react-router-dom";
import SuccessComment from "../components/SuccessComment";

const MissionSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // location.state로부터 동적으로 넘어온 데이터
  const { missionExp, userLevel, userExp, userLevelMaxExp } =
    location.state || {};

  // SuccessComment 표시 상태 관리
  const [showSuccessComment, setShowSuccessComment] = useState(true);

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

      {/* 3초 뒤에 SuccessComment를 숨김 */}
      {showSuccessComment && (
        <SuccessCommentEvent
          onAnimationEnd={() => setShowSuccessComment(false)}
        />
      )}

      <SuccessComment></SuccessComment>

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
