import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import CreateMission from "../components/CreateMission";
import CurrentMission from "../components/CurrentMission";
import MissionList from "../components/MissionList";

const Missions = () => {
  const [nickName, setNickName] = useState(""); // 닉네임 상태 관리
  const [missionList, setMissionList] = useState([]); // 미션 리스트 상태 관리
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜 상태

  // 현재 날짜를 yyyy-mm-dd 형식으로 반환하는 함수
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // API 호출 함수 (날짜에 따라 호출)
  const fetchMissionHistory = async (date) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = `${apiBaseUrl}/mission-histories?date=${date}`;

    setLoading(true);

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === "success") {
        setNickName(data.result.nickName); // 닉네임 상태 업데이트
        setMissionList(data.result.missionList); // 미션 리스트 상태 업데이트
      } else {
        setError("데이터를 가져오는 데 실패했습니다.");
      }
    } catch (err) {
      setError("서버와의 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  // 최초 렌더링 시와, 날짜 변경 시 API 호출
  useEffect(() => {
    const date = formatDate(currentDate); // 현재 날짜로 API 호출
    fetchMissionHistory(date);
  }, [currentDate]); // currentDate가 변경될 때마다 API 호출

  // 날짜를 하루 감소시키는 함수
  const handlePreviousDay = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 1))
    );
  };

  // 날짜를 하루 증가시키는 함수
  const handleNextDay = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1))
    );
  };

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 상태
  }

  if (error) {
    return <div>{error}</div>; // 에러 상태
  }

  return (
    <div>
      <Header
        leftChild={
          <Button
            text={<img src={left} alt="Back" />}
            type="icon"
            onClick={() => console.log("Back button clicked")}
          />
        }
        title={<img src={mainLogo} alt="mainLogo" />}
        rightChild={
          <div>
            <Button
              text={<img src={info} alt="info" />}
              type="icon"
              onClick={() => console.log("Notification button clicked")}
            />
          </div>
        }
      />

      {/* CreateMission과 CurrentMission에 nickName과 날짜 관련 데이터 전달 */}
      <CreateMission nickName={nickName} text="새로운 미션을 만들어보세요!" />
      <CurrentMission
        nickName={nickName}
        currentDate={currentDate}
        handlePreviousDay={handlePreviousDay}
        handleNextDay={handleNextDay}
      />
      <MissionList missionList={missionList} />

      <Footer />
    </div>
  );
};

export default Missions;
