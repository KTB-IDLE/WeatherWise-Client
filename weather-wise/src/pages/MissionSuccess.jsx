import React, { useState, useEffect } from "react";
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

  // 상태 관리: SuccessCommentEvent 표시 여부
  const [showSuccessCommentEvent, setShowSuccessCommentEvent] = useState(true);

  useEffect(() => {
    // 3초 후 SuccessCommentEvent를 숨기고 SuccessComment와 SuccessInfo를 표시
    const timer = setTimeout(() => {
      setShowSuccessCommentEvent(false);
    }, 3000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(timer);
  }, []);

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

      {/* SuccessCommentEvent가 표시될 때 */}
      {showSuccessCommentEvent && (
        <SuccessCommentEvent
          onAnimationEnd={() => setShowSuccessCommentEvent(false)}
        />
      )}

      {/* SuccessComment와 SuccessInfo는 SuccessCommentEvent가 끝난 후에만 표시 */}
      {!showSuccessCommentEvent && (
        <>
          <SuccessComment />
          <SuccessInfo
            missionExp={missionExp}
            userLevel={userLevel}
            userExp={userExp}
            userLevelMaxExp={100 - userExp}
          />
        </>
      )}

      <Footer />
    </div>
  );
};

export default MissionSuccess;
