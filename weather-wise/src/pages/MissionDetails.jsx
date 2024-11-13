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
import { useNavigate } from "react-router-dom";

const MissionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [missionDetails, setMissionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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
        const data = response.data;
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

  // Extract necessary data and check if it's today
  const { missionName, completed, storeFileName, nickName, missionDate } =
    missionDetails || {};
  const today = new Date();
  const missionDateObj = new Date(missionDate);
  const isToday = missionDateObj.toDateString() === today.toDateString();

  return (
    <div>
      {/* Header */}
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

      <div>
        <MissionDetailsHedaer nickName={nickName} />
        <MissionName missionName={missionName} />
        <MissionImage
          completed={completed}
          storeFileName={storeFileName}
          setImageFile={setImageFile}
          selectedImage={selectedImage}
          resetImage={resetImage}
          setSelectedImage={setSelectedImage}
        />
        {/* Pass isToday to MissionAuth */}
        <MissionAuth
          completed={completed}
          id={id}
          imageFile={imageFile}
          resetImage={resetImage}
          isToday={isToday} // Add this line
        />
      </div>

      <Footer />
    </div>
  );
};

export default MissionDetails;
