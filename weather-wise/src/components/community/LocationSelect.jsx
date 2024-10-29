import React, { useState, useEffect } from 'react';
import KakaoMap from './KakaoMap';
import locationIcon from '../../assets/location.png'; // 이미지 경로 추가
import './LocationSelect.css';

function LocationSelect({ location, setLocation }) {
  const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 상태 관리
  const [showMap, setShowMap] = useState(false); // 지도 상태 관리

  // Default location 
  const defaultLocation = {
    name: '서울특별시 강남구 대치동',
    latitude: 37.499920,
    longitude: 127.037840,
  };

  // 현재 위치를 기본 설정으로 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            name: '사용자 위치 반영중...',  // 초기 값은 업데이트되기 전
            latitude,
            longitude,
          });

          // Kakao API를 통해 사용자의 위치로 주소 변환
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              setLocation({
                name: result[0].address_name, // 실제 위치 이름으로 업데이트
                latitude,
                longitude,
              });

              setShowDropdown(false); 
            }
          });
        },
        () => {
          // 위치 가져오기 실패 시 기본 위치로 설정
          setLocation(defaultLocation);
          setShowDropdown(false); 
        }
      );
    } else {
      // Geolocation을 지원하지 않을 때 기본 위치로 설정
      setLocation(defaultLocation);
    }
  }, [setLocation]);


  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    setShowMap(false);
    setShowDropdown(false); 
  };

  return (
    <div className="location-select">
      <span className="location-name">{location.name}</span>
      <button 
        className="location-button" 
        onClick={() => setShowDropdown(!showDropdown)} // 드롭다운 토글
      >
        <img src={locationIcon} alt="location icon" /> {/* location.png 이미지 사용 */}
      </button>

      {/* 드롭다운 표시 */}
      {showDropdown && (
        <div className="location-dropdown">
          <div className="location-dropdown-item" onClick={() => setShowMap(true)}>
            위치 변경하기
          </div>
        </div>
      )}

      {/* KakaoMap 지도 표시 */}
      {showMap && <KakaoMap onSelectLocation={handleLocationChange} defaultLocation={location} />}
    </div>
  );
}

export default LocationSelect;
