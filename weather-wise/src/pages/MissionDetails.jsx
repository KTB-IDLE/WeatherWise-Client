import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button"; // Button 컴포넌트를 불러옴
import Footer from "../components/Footer";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import { useParams } from "react-router-dom";
import MissionAuth from "../components/MissionAuth";
import MissionImage from "../components/MissionImage";
import MissionDetailsHedaer from "../components/MissionDetailsHedaer";
import MissionName from "../components/MissionName";

const MissionDetails = () => {
  const { id } = useParams(); // URL에서 id 값을 가져옴
  const [missionDetails, setMissionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMissionDetails = async () => {
      const url = `http://localhost:8080/api/mission-histories/${id}`; // API 요청 경로
      setLoading(true);
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.code === "success") {
          setMissionDetails(data.result); // missionDetails 상태에 API 데이터 저장
        } else {
          setError("데이터를 가져오는 데 실패했습니다.");
        }
      } catch (err) {
        setError("서버와의 통신 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMissionDetails();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  // missionDetails에서 데이터를 추출
  const { nickName, missionName, completed, uploadFileLink } = missionDetails;

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

      {/* CreateMission 컴포넌트에 nickName 전달 */}
      <MissionDetailsHedaer nickName={nickName} />

      <MissionName missionName={missionName} />

      {/* MissionImage에 completed와 uploadFileLink 값 전달 */}
      <MissionImage completed={completed} uploadFileLink={uploadFileLink} />

      <MissionAuth completed={completed} />
      <Footer />
    </div>
  );
};

export default MissionDetails;
