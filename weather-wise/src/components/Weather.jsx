import React, { useState, useEffect } from "react";
import KakaoMap from "./community/KakaoMap"; // KakaoMap 컴포넌트 불러오기
import test from "../assets/test.jpeg";
import sunny from "../assets/sunny.jpeg";
import rain from "../assets/rain.jpg";
import snow from "../assets/snow.png";
import locationIcon from "../assets/location.png"; // 삼각형 아이콘
import "../components/Weather.css";
import AxiosInstance from "../utils/AxiosInstance"; // AI 서버 전송용 Axios
import { getCachedWeather, setCachedWeather } from "../utils/localStorageUtils"; // 캐싱 유틸리티 함수

// 소수점 5자리로 반올림하는 함수
const roundToFiveDecimals = (num) => {
  return parseFloat(num.toFixed(4));
};

const MainWeather = ({ initialWeatherData }) => {
  const [location, setLocation] = useState({
    name: "서울특별시 강남구 대치동", // 기본 위치
    latitude: roundToFiveDecimals(37.49992),
    longitude: roundToFiveDecimals(127.03784),
  });
  const [weatherData, setWeatherData] = useState(initialWeatherData || {});
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

      // 데이터 업데이트 및 캐싱
      setWeatherData(data);
      setCachedWeather(key, data); // 데이터를 캐싱
    } catch (error) {
      console.error("서버에 위치 전송 오류:", error);
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
  const getBackgroundImage = () => {
    if (weatherData.Is_Rained) return rain;
    if (weatherData.Is_Snowed) return snow;
    if (weatherData.Sky_Condition === "맑음") return sunny;
    return test;
  };

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = roundToFiveDecimals(position.coords.latitude);
            const longitude = roundToFiveDecimals(position.coords.longitude);

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

  return (
    <div
      className="weather-container"
      style={{ backgroundImage: `url(${getBackgroundImage()})` }}
    >
      <div className="weather-info">
        <h3 className="city">
          {loading ? "위치 가져오는 중..." : location.name}
          <button
            className="location-button"
            onClick={() => setShowMap((prev) => !prev)}
          >
            <img src={locationIcon} alt="location icon" />
          </button>
        </h3>
        <h1 className="temperature">{temperature || "로딩중"}</h1>

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
            const latitude = roundToFiveDecimals(newLoc.latitude);
            const longitude = roundToFiveDecimals(newLoc.longitude);

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
