import React, { useState, useEffect } from "react";
import KakaoMap from "./community/KakaoMap";  // KakaoMap 컴포넌트 불러오기
import test from "../assets/test.jpeg";
import locationIcon from "../assets/location.png"; // 삼각형 아이콘
import "../components/Weather.css";
import AxiosInstance from "../utils/AxiosInstance"; // AI 서버 전송용 Axios

const mainWeather = () => {
  const [location, setLocation] = useState({
    name: "서울특별시 강남구 대치동", // 기본 위치
    latitude: 37.499920,
    longitude: 127.037840,
  });
  const [temperature, setTemperature] = useState("23");
  const [description, setDescription] = useState("대체로 맑음");
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true);

  // 위치 정보 가져오기 (최초 로딩 시)
  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const locationName = result[0].region_3depth_name || result[0].address_name;
                setLocation({ name: locationName, latitude, longitude });
                sendLocationToAIServer(latitude, longitude); // AI 서버로 전송
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
            sendLocationToAIServer(location.latitude, location.longitude);
            setLoading(false);
          }
        );
      } else {
        setLocation((prev) => ({
          ...prev,
          name: "서울특별시 강남구 대치동",
        }));
        sendLocationToAIServer(location.latitude, location.longitude);
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  // AI 서버로 위치 정보 전송
  const sendLocationToAIServer = async (latitude, longitude) => {
    try {
      await AxiosInstance.post("/ai/location", { latitude, longitude });
      console.log("AI 서버에 위치 정보 전송 완료");
    } catch (error) {
      console.error("AI 서버에 위치 전송 오류:", error);
    }
  };

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
        <h1 className="temperature">{temperature}</h1>
        <h3 className="description">{description}</h3>
        <p className="high-low">최고: 26° 최저: 19°</p>
      </div>

      {/* KakaoMap 지도 표시 */}
      {showMap && (
        <KakaoMap
          onSelectLocation={(newLoc) => {
            const { latitude, longitude } = newLoc;
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const locationName = result[0].region_3depth_name || result[0].address_name;
                setLocation({ name: locationName, latitude, longitude });
                sendLocationToAIServer(latitude, longitude); // AI 서버로 새 위치 전송
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

export default mainWeather;
