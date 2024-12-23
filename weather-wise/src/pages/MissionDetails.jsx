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
import AxiosInstance from "../utils/AxiosInstance";
import "./MissionDetails.css";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "./Loading";

const MissionDetails = () => {
  const location = useLocation();
  const { isToday } = location.state || {};
  const navigate = useNavigate();
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
      const url = `/mission-histories/${id}`;
      setLoading(true);
      try {
        const response = await AxiosInstance.get(url);
        console.log(response);
        const data = response.data;
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

  if (loading) {
    return <Loading />;
  }
  if (error) return <div>{error}</div>;

  const {
    missionName,
    completed,
    storeFileName,
    nickName,
    missionDate,
    missionDescription,
  } = missionDetails || {};

  const missionDateObj = new Date(missionDate);

  return (
    <div>
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

      {/* 단일 미션 데이터를 렌더링 */}
      {/* 본문 컨테이너 */}
      <div className="mission-details-container">
        <MissionName
          missionName={missionName}
          missionDescription={missionDescription}
        />
        <MissionImage
          completed={completed}
          storeFileName={storeFileName}
          setImageFile={setImageFile}
          selectedImage={selectedImage}
          resetImage={resetImage}
          setSelectedImage={setSelectedImage}
        />
        <MissionAuth
          completed={completed}
          id={id}
          imageFile={imageFile}
          resetImage={resetImage}
          isToday={isToday}
        />
      </div>
      <Footer />
    </div>
  );
};

export default MissionDetails;
