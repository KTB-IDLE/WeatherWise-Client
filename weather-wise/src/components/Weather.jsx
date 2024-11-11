import React, { useState, useEffect } from "react";
import KakaoMap from "./community/KakaoMap"; // KakaoMap 컴포넌트 불러오기
import test from "../assets/test.jpeg";
import locationIcon from "../assets/location.png"; // 삼각형 아이콘
import "../components/Weather.css";
import AxiosInstance from "../utils/AxiosInstance"; // AI 서버 전송용 Axios

const MainWeather = ({ initialWeatherData }) => {
  const [location, setLocation] = useState({
    name: "서울특별시 강남구 대치동", // 기본 위치
    latitude: 37.49992,
    longitude: 127.03784,
  });
  const [weatherData, setWeatherData] = useState(initialWeatherData || {});
  const [temperature, setTemperature] = useState("");
  const [description, setDescription] = useState("");
  const [maxTemp, setMaxTemp] = useState("");
  const [minTemp, setMinTemp] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMissionHistory = async (latitude, longitude) => {
    const url = `/home`;
    setLoading(true);

    try {
      const response = await AxiosInstance.get(url, {
        params: { latitude, longitude },
      });
      const data = response.data.result.weatherResponse;

      console.log("서버 응답 데이터:", data);
      setWeatherData(data); // 새 weatherData로 업데이트
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
    }
  }, [weatherData]);

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const locationName =
                  result[0].region_3depth_name || result[0].address_name;
                setLocation({ name: locationName, latitude, longitude });
                fetchMissionHistory(latitude, longitude);
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
            fetchMissionHistory(location.latitude, location.longitude);
            setLoading(false);
          }
        );
      } else {
        setLocation((prev) => ({
          ...prev,
          name: "서울특별시 강남구 대치동",
        }));
        fetchMissionHistory(location.latitude, location.longitude);
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return (
    <div
      className="weather-container"
      style={{ backgroundImage: `url(${test})` }}
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
            const { latitude, longitude } = newLoc;
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const locationName =
                  result[0].region_3depth_name || result[0].address_name;
                setLocation({ name: locationName, latitude, longitude });
                fetchMissionHistory(latitude, longitude);
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
