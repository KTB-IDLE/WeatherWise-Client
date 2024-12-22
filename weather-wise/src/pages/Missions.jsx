import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import CreateMission from "../components/CreateMission";
import CurrentMission from "../components/CurrentMission";
import MissionList from "../components/MissionList";
import AxiosInstance from "../utils/AxiosInstance";
import "./Missions.css";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const Missions = () => {
  const navigate = useNavigate();
  const [nickName, setNickName] = useState("");
  const [missionList, setMissionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isToday, setIsToday] = useState(true);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchMissionHistory = async (date) => {
    const url = `/mission-histories?date=${date}`;
    setLoading(true);

    try {
      const response = await AxiosInstance.get(url);
      const data = response.data;

      if (data.code === "success") {
        setNickName(data.result.nickName);
        setMissionList(
          data.result.missionList.map((mission) => ({
            ...mission,
            missionTime: mission.missionTime, // 서버에서 온 missionTime 값 그대로 유지
          }))
        );
      } else {
        setError("데이터를 가져오는 데 실패했습니다.");
      }
    } catch (err) {
      console.log(err);
      setError("서버와의 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const date = formatDate(currentDate);
    fetchMissionHistory(date);

    const today = formatDate(new Date());
    setIsToday(today === date);
  }, [currentDate]);

  const handlePreviousDay = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 1))
    );
  };

  const handleNextDay = () => {
    if (!isToday) {
      setCurrentDate(
        (prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1))
      );
    }
  };

  const addMissionToList = (newMission) => {
    setMissionList((prevList) => [...prevList, newMission]);
  };

  // 🔑 동적으로 h1 문구 설정
  const getMissionTitle = () => {
    if (missionList.length === 0) {
      return "새로운 미션을 만들어보세요!";
    }

    const allMissionsCompleted = missionList.every(
      (mission) => mission.completed === true
    );

    console.log(missionList);

    console.log(allMissionsCompleted);

    if (allMissionsCompleted) {
      return "오늘의 미션 성공!";
    }

    return "미션 진행중!";
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* 헤더 */}
      <Header
        leftChild={<Button text={<img src={left} alt="Back" />} type="icon" />}
        title={<img src={mainLogo} alt="mainLogo" />}
      />

      {/* 동적으로 문구를 변경하는 h1 */}
      <h1 className="mission-title">{getMissionTitle()}</h1>

      <CurrentMission
        nickName={nickName}
        currentDate={currentDate}
        handlePreviousDay={handlePreviousDay}
        handleNextDay={handleNextDay}
        isToday={isToday}
      />
      <MissionList missionList={missionList} isToday={isToday} />
      <CreateMission
        nickName={nickName}
        onMissionCreate={addMissionToList}
        isToday={isToday}
        missionCount={missionList.length}
      />

      <Footer />
    </div>
  );
};

export default Missions;
