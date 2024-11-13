import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import Weather from "../components/Weather";
import Summary from "../components/Summary";
import AxiosInstance from "../utils/AxiosInstance";
import Modal from "../components/Modal";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [size, setSize] = useState(0);
  const [aiMessage, setAiMessage] = useState("");

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await AxiosInstance.get("/home", {
          params: { latitude: 37.49992, longitude: 127.03784 },
        });

        if (response.status === 200) {
          const { didSurvey, weatherResponse, size } = response.data.result; // 'size' 값을 가져옴

          if (!didSurvey) {
            setIsModalOpen(true);
          } else {
            setWeatherData(weatherResponse);
            setSize(size); // 'size' 상태 업데이트
            setAiMessage(weatherResponse.AI_message); // 'AI_message' 설정
          }
        } else {
          console.error("데이터 가져오기 실패:", response.statusText);
        }
      } catch (error) {
        console.error("API 호출 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSurveyStart = () => {
    setIsModalOpen(false);
    navigate("/survey");
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <Header
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
      <Modal
        isOpen={isModalOpen}
        onClose={handleSurveyStart}
        message="설문조사를 시작할게요!"
      />
      <Weather weatherData={weatherData} />
      <Summary size={size} aiMessage={aiMessage} />
      <Footer />
    </div>
  );
};

export default Home;
