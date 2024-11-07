import React, { useState, useEffect } from 'react';
import KakaoMap from './KakaoMap';
import locationIcon from '../../assets/location.png';
import './LocationSelect.css';

function LocationSelect({ location, setLocation }) {
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true);

  const defaultLocation = {
    name: '서울특별시 강남구 대치동 (기본위치)',
    latitude: 37.499920,
    longitude: 127.037840,
  };

  const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;

  const loadKakaoMapScript = () => {
    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        resolve(); // 이미 스크립트 로드됨
      } else {
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&libraries=services`;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      }
    });
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        await loadKakaoMapScript();
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const geocoder = new window.kakao.maps.services.Geocoder();
              geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                  setLocation({ name: result[0].address_name, latitude, longitude });
                } else {
                  setLocation(defaultLocation);
                }
                setLoading(false);
              });
            },
            () => {
              setLocation(defaultLocation);
              setLoading(false);
            }
          );
        } else {
          setLocation(defaultLocation);
          setLoading(false);
        }
      } catch (error) {
        console.error("카카오 지도 로드 오류:", error);
        setLocation(defaultLocation);
        setLoading(false);
      }
    };

    fetchLocation();
  }, [setLocation]);

  return (
    <div className="location-select">
      <span className="location-name">{loading ? "위치 가져오는 중..." : location.name}</span>
      <button className="location-button" onClick={() => setShowMap(!showMap)}>
        <img src={locationIcon} alt="location icon" />
      </button>

      {showMap && (
        <KakaoMap
          onSelectLocation={(newLoc) => {
            setLocation(newLoc);
            setShowMap(false); // 위치 선택 후 지도 닫기
          }}
          defaultLocation={location || defaultLocation}
        />
      )}
    </div>
  );
}

export default LocationSelect;
