import React, { useState, useEffect } from "react";
import KakaoMap from "./community/KakaoMap"; // KakaoMap 컴포넌트 불러오기
import sunnyIcon from "../assets/sunnyIcon.png";
import rainIcon from "../assets/rainIcon.png";
import snowIcon from "../assets/snowIcon.png";
import cloudyIcon from "../assets/cloudyIcon.png";
import locationIcon from "../assets/location.png"; // 삼각형 아이콘
import defaultWeatherIcon from "../assets/mainLogo_2.png"; 
import "../components/Weather.css";
import AxiosInstance from "../utils/AxiosInstance"; // AI 서버 전송용 Axios
import { getCachedWeather, setCachedWeather } from "../utils/localStorageUtils"; // 캐싱 유틸리티 함수

// 소수점 5자리로 반올림하는 함수
const roundToFiveDecimals = (num) => {
  return parseFloat(num.toFixed(4));
};
const MainWeather = ({ onLocationdataUpdate , onAiMessageUpdate }) => {
  const [location, setLocation] = useState({
    name: "서울특별시 강남구 대치동", // 기본 위치
    latitude: 37.49992,
    longitude: 127.03784,
  });
  const [weatherData, setWeatherData] = useState("");
  const [locationData, setLocationData] = useState("");
  const [temperature, setTemperature] = useState("");
  const [description, setDescription] = useState("");
  const [maxTemp, setMaxTemp] = useState("");
  const [minTemp, setMinTemp] = useState("");
  const [precipitation, setPrecipitation] = useState(null); // 강수량 표시
  const [snowfall, setSnowfall] = useState(null); // 적설량 표시

  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWeatherData = async (latitude, longitude) => {
    const key = `${latitude}_${longitude}`; // 캐싱 키 생성
    const cachedWeather = getCachedWeather(key); // 캐싱된 데이터 확인

    if (cachedWeather) {
      console.log("캐싱된 데이터 사용:", cachedWeather);
      setWeatherData(cachedWeather);
            // aiMessage를 업데이트하는 콜백 호출
      if (onAiMessageUpdate && cachedWeather.AI_message) {
        onAiMessageUpdate(cachedWeather.AI_message);
      }
      setLoading(false);
      return;
    }

    console.log("API 호출 중...");
    setLoading(true);

    try {
      const response = await AxiosInstance.get("/home", {
        params: { latitude, longitude },
      });

      const data = response.data.result.weatherResponse;
      console.log("서버 응답 데이터:", data);

      setWeatherData(data); // 날씨 데이터 업데이트
      const newLocation = { latitude, longitude };
      setLocationData(newLocation);

      if (onLocationdataUpdate) {
        onLocationdataUpdate(newLocation);
      }

            // aiMessage를 업데이트하는 콜백 호출
      if (onAiMessageUpdate && data.AI_message) {
        onAiMessageUpdate(data.AI_message);
      }

      setCachedWeather(key, data); // 캐싱 저장
    } catch (error) {
      console.error("서버에 위치 전송 오류:", error);
      setWeatherData(null); // 오류 발생 시 기본 값
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (weatherData) {
      setTemperature(
        weatherData.Current_Temperature
          ? `${weatherData.Current_Temperature}°`
          : ""
      );
      setDescription(weatherData.Sky_Condition || "");
      setMaxTemp(
        weatherData.Maximum_Temperature
          ? `${weatherData.Maximum_Temperature}°`
          : ""
      );
      setMinTemp(
        weatherData.Minimum_Temperature
          ? `${weatherData.Minimum_Temperature}°`
          : ""
      );

      // 강수와 적설 상태를 업데이트
      setPrecipitation(
        weatherData.Is_Rained ? weatherData.Precipitation_Amount : null
      );
      setSnowfall(weatherData.Is_Snowed ? weatherData.Snowfall_Amount : null);
    }
  }, [weatherData]);

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const locationName =
                  result[0].region_3depth_name || result[0].address_name;
                setLocation({ name: locationName, latitude, longitude });
                fetchWeatherData(latitude, longitude);
              } else {
                setLocation((prev) => ({ ...prev, ...location }));
              }
              setLoading(false);
            });
          },
          () => {
            setLocation((prev) => ({
              ...prev,
              name: "서울특별시 강남구 대치동",
            }));
            fetchWeatherData(location.latitude, location.longitude);
            setLoading(false);
          }
        );
      } else {
        setLocation((prev) => ({
          ...prev,
          name: "서울특별시 강남구 대치동",
        }));
        fetchWeatherData(location.latitude, location.longitude);
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const getBackgroundStyle = () => {
    if (!weatherData) {
      return { background: "linear-gradient(to bottom, #faf3e0, #f5e8d9)" }; // 기본 배경
    }
    if (weatherData.Is_Rained)
      return { background: "linear-gradient(to bottom, #a1c4fd, #c2e9fb)" }; // 비 (연한 블루 그라데이션)
    if (weatherData.Is_Snowed)
      return { background: "linear-gradient(to bottom, #d4fcff, #eaf9ff)" }; // 눈 (연한 화이트-블루 그라데이션)
    if (weatherData.Sky_Condition === "맑음")
      return { background: "linear-gradient(to bottom, #fff9c4, #ffe29f)" }; // 맑음 (연한 옐로우-오렌지 그라데이션)
    return { background: "linear-gradient(to bottom, #ececec, #f5f5f5)" }; // 흐림 (연한 그레이-화이트 그라데이션)
  };ㅋ

  // 날씨에 따른 아이콘 선택 함수
  const getWeatherIcon = () => {
    if (!weatherData) return defaultWeatherIcon; // 기본 아이콘
    if (weatherData.Is_Rained) return rainIcon;
    if (weatherData.Is_Snowed) return snowIcon;
    if (weatherData.Sky_Condition === "맑음") return sunnyIcon;
    return cloudyIcon;
  };

  return (
    <div
      className="weather-container"
      style={getBackgroundStyle()} // 동적 스타일
    >
      <h3 className="city">
        {loading ? "위치 가져오는 중..." : location.name}
        <button
          className="location-button"
          onClick={() => setShowMap((prev) => !prev)}
        >
          <img src={locationIcon} alt="location icon" />
        </button>
      </h3>
      {/* 날씨 아이콘 */}
      <div className="weather-icon">
        <img src={getWeatherIcon()} alt="Weather Icon" />
      </div>

      <div className="weather-info">
        <h1 className={`temperature ${!temperature && "loading"}`}>
          {temperature || "로딩중"}
        </h1>

        {/* description이 있을 때만 표시 */}
        {description && <h3 className="description">{description}</h3>}

        {/* 강수량 표시 */}
        {precipitation && <p className="precipitation">🌧️ {precipitation}</p>}

        {/* 적설량 표시 */}
        {snowfall && <p className="snowfall">❄️ {snowfall}</p>}

        {/* 최고 기온과 최저 기온이 있을 때만 표시 */}
        {(maxTemp || minTemp) && (
          <p className="high-low">
            {maxTemp && `최고: ${maxTemp}`} {minTemp && `최저: ${minTemp}`}
          </p>
        )}
      </div>

      {/* KakaoMap 지도 표시 */}
      {showMap && (
        <KakaoMap
          onSelectLocation={(newLoc) => {
            const latitude = newLoc.latitude;
            const longitude = newLoc.longitude;

            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const locationName =
                  result[0].region_3depth_name || result[0].address_name;
                setLocation({ name: locationName, latitude, longitude });
                fetchWeatherData(latitude, longitude);
              }
            });
            setShowMap(false);
          }}
          defaultLocation={location}
          className="location-select-main"
        />
      )}
    </div>
  );
};

export default MainWeather;
