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
import AxiosInstance from "../utils/AxiosInstance";

const Missions = () => {
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
        setMissionList(data.result.missionList);
        localStorage.setItem(
          "missionList",
          JSON.stringify(data.result.missionList)
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

    const savedMissionList = JSON.parse(localStorage.getItem("missionList"));
    if (savedMissionList) setMissionList(savedMissionList);
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
    const updatedMissionList = [...missionList, newMission];
    localStorage.setItem("missionList", JSON.stringify(updatedMissionList));
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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
          <Button
            text={<img src={info} alt="info" />}
            type="icon"
            onClick={() => console.log("Notification button clicked")}
          />
        }
      />

      <CreateMission
        nickName={nickName}
        text="새로운 미션을 만들어보세요!"
        onMissionCreate={addMissionToList}
        isToday={isToday}
        missionCount={missionList.length}
      />
      <CurrentMission
        nickName={nickName}
        currentDate={currentDate}
        handlePreviousDay={handlePreviousDay}
        handleNextDay={handleNextDay}
        isToday={isToday}
      />
      <MissionList missionList={missionList} />

      <Footer />
    </div>
  );
};

export default Missions;
