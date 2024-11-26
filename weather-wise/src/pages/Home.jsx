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

// 소수점 5자리까지 반올림하는 함수
const roundToFiveDecimals = (num) => {
  return parseFloat(num.toFixed(4));
};

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [size, setSize] = useState(0);
  const [aiMessage, setAiMessage] = useState("");

  useEffect(() => {
    const latitude = roundToFiveDecimals(37.49992);
    const longitude = roundToFiveDecimals(127.03784);
    const key = `${latitude}_${longitude}`; // 로컬 스토리지 키 생성

    const fetchHomeData = async () => {
      const cachedWeather = getCachedWeather(key); // 캐싱된 데이터 가져오기

      if (cachedWeather) {
        console.log("캐싱된 데이터 사용:", cachedWeather);

        if (cachedWeather.weatherResponse) {
          setWeatherData(cachedWeather.weatherResponse);
          setSize(cachedWeather.size || 0);
          setAiMessage(cachedWeather.weatherResponse.AI_message || ""); // AI_message가 없는 경우 대비
        } else {
          console.error("캐싱된 weatherResponse가 존재하지 않습니다.");
        }

        setLoading(false);
        return;
      }

      // 캐싱된 데이터가 없으면 API 호출
      console.log("API 호출 중...");
      try {
        const response = await AxiosInstance.get("/home", {
          params: { latitude, longitude },
        });

        if (response.status === 200) {
          const { didSurvey, weatherResponse, size } = response.data.result;

          if (!didSurvey) {
            setIsModalOpen(true);
          } else {
            setWeatherData(weatherResponse);
            setSize(size);
            setAiMessage(weatherResponse.AI_message);

            // 데이터를 로컬 스토리지에 저장
            setCachedWeather(key, { weatherResponse, size });
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
    return <Loading />;
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
