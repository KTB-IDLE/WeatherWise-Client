import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
          setMissionDetails(data.result);
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

  return (
    <div>
      <h1>{missionDetails.name}</h1>
      <p>경험치: {missionDetails.point}</p>
      <p>상태: {missionDetails.completed ? "성공" : "진행중"}</p>
    </div>
  );
};

export default MissionDetails;
