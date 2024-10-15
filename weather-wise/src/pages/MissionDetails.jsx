import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
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
  const [imageFile, setImageFile] = useState(null); // 이미지 파일 상태 추가

  useEffect(() => {
    const fetchMissionDetails = async () => {
      const url = `http://localhost:8080/api/mission-histories/${id}`;
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

      {/* MissionDetailsHedaer */}
      <MissionDetailsHedaer nickName={nickName} />

      <MissionName missionName={missionName} />

      {/* MissionImage에 이미지 파일 상태 관리 함수를 전달 */}
      <MissionImage
        completed={completed}
        uploadFileLink={uploadFileLink}
        setImageFile={setImageFile} // 이미지 파일 상태 관리
      />

      {/* MissionAuth에 이미지 파일 전달 */}
      <MissionAuth completed={completed} id={id} imageFile={imageFile} />

      <Footer />
    </div>
  );
};

export default MissionDetails;
