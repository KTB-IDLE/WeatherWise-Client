// Home.jsx
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
import Loading from "./Loading";
import { getCachedWeather, setCachedWeather } from "../utils/localStorageUtils";
import ChatbotButton from "../components/ChatbotButton"; // 챗봇 버튼 컴포넌트 import

// 소수점 5자리까지 반올림하는 함수
const roundToFiveDecimals = (num) => {
  return parseFloat(num.toFixed(4));
};

const Home = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [aiMessage, setAiMessage] = useState("");

  // Weather 컴포넌트에서 날씨 데이터를 받아서 state에 저장
  const handleLocationDataUpdate = (loc) => {
    console.log("Home에서 받은 위치:", loc);
    setLocationData(loc);
  };

  // MainWeather 컴포넌트에서 aiMessage를 받아서 state에 저장하는 함수
  const handleAiMessageUpdate = (message) => {
    console.log("Home에서 받은 AI 메시지:", message);
    setAiMessage(message);
  };

  useEffect(() => {
    // 페이지 이동 시 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
    const latitude = roundToFiveDecimals(37.49992);
    const longitude = roundToFiveDecimals(127.03784);
    const key = `${latitude}_${longitude}`; // 로컬 스토리지 키 생성

    const fetchHomeData = async () => {
      const cachedWeather = getCachedWeather(key); // 캐싱된 데이터 가져오기

      if (cachedWeather) {
        console.log("캐싱된 데이터 사용:", cachedWeather);

        // cachedWeather는 weatherResponse 자체임
        setWeatherData(cachedWeather); // 직접 설정
        setAiMessage(cachedWeather.AI_message || ""); // AI_message 설정

        setLoading(false);
        return;
      }

      // 캐싱된 데이터가 없으면 API 호출
      console.log("API 호출 중...");
      try {
        const response = await AxiosInstance.get("/survey");

        console.log(response);

        if (response.status === 200) {
          const didSurvey = response.data;
          if (!didSurvey) {
            setIsModalOpen(true);
          }
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
    navigate("/surveyex");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="home-container">
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
      {/* MainWeather 컴포넌트에 aiMessage 업데이트 콜백 전달 */}
      <Weather
        onLocationdataUpdate={handleLocationDataUpdate}
        onAiMessageUpdate={handleAiMessageUpdate}
      />
      {/* Summary 컴포넌트에 aiMessage 전달 */}
      <Summary aiMessage={aiMessage} locationData={locationData} />
      <ChatbotButton /> {/* 챗봇 버튼 추가 */}
      <Footer />
    </div>
  );
};

export default Home;
