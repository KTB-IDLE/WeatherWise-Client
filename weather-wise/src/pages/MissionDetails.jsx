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
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 URL 상태 추가

  // 이미지 초기화 함수 정의
  const resetImage = () => {
    setSelectedImage(null);
    setImageFile(null);
  };

  useEffect(() => {
    const fetchMissionDetails = async () => {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const url = `${apiBaseUrl}/mission-histories/${id}`;
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

  // missionDetails에서 필요한 데이터 추출
  const { missionName, completed, uploadFileLink, nickName } =
    missionDetails || {};

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

      {/* 단일 미션 데이터를 렌더링 */}
      <div>
        {/* MissionDetailsHedaer에 nickName 전달 */}
        <MissionDetailsHedaer nickName={nickName} />
        <MissionName missionName={missionName} />
        <MissionImage
          completed={completed} // 미션의 completed 값 전달
          uploadFileLink={uploadFileLink} // 서버에서 받은 파일 링크 전달
          setImageFile={setImageFile}
          selectedImage={selectedImage}
          resetImage={resetImage}
          setSelectedImage={setSelectedImage} // 이미지 초기화 및 상태 관리
        />
        <MissionAuth
          completed={completed}
          id={id}
          imageFile={imageFile}
          resetImage={resetImage}
        />
      </div>

      <Footer />
    </div>
  );
};

export default MissionDetails;
