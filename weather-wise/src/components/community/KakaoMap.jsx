import React, { useEffect, useState } from 'react';
import './KakaoMap.css';

function KakaoMap({ onSelectLocation, defaultLocation }) {
  const [map, setMap] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(''); // 검색어 상태 추가
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태 추가
  const [placesService, setPlacesService] = useState(null); // 장소 검색 서비스 상태 추가
  const [locationName, setLocationName] = useState(''); // 현재 위치명 상태 추가

  // 기본 위치를 사용하지 않았을 때를 대비한 fallback (서울 강남구 좌표)
  const defaultCoords = defaultLocation || {
    latitude: 37.499920,
    longitude: 127.037840,
  };

  // .env 파일에서 API 키 가져오기
  const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const container = document.getElementById('kakao-map');
          const options = {
            center: new window.kakao.maps.LatLng(defaultCoords.latitude, defaultCoords.longitude), // 초기값은 전달받은 defaultLocation
            level: 3,
          };

          const mapInstance = new window.kakao.maps.Map(container, options);
          setMap(mapInstance);

          // 장소 검색 서비스 인스턴스 생성
          const ps = new window.kakao.maps.services.Places(mapInstance);
          setPlacesService(ps);

          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(defaultCoords.latitude, defaultCoords.longitude),
          });
          marker.setMap(mapInstance);

          // 지도 클릭 시 마커 이동 및 좌표 정보 받아오기
          window.kakao.maps.event.addListener(mapInstance, 'click', (mouseEvent) => {
            const latlng = mouseEvent.latLng;
            marker.setPosition(latlng);

            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2RegionCode(latlng.getLng(), latlng.getLat(), (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const locationName = result[0].address_name;
                onSelectLocation({
                  name: locationName,
                  latitude: latlng.getLat(),
                  longitude: latlng.getLng(),
                });
              }
            });
          });
        });
      } else {
        console.error("Kakao Map script did not load properly.");
      }
    };

    script.onerror = () => {
      console.error("Kakao Map script failed to load. Please check the API key.");
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [KAKAO_API_KEY, defaultLocation, onSelectLocation]);


   // 장소 검색 핸들러
   const handleSearch = () => {
    if (!placesService || !searchKeyword) return;

    placesService.keywordSearch(searchKeyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(data); // 검색 결과 상태에 저장
      } else {
        console.warn("No results found");
        setSearchResults([]);
      }
    });
  };

  // 검색 결과 클릭 시 해당 위치로 이동 (검색한 위치명으로 설정됨)
  const handleResultClick_1 = (place) => {
    const latLng = new window.kakao.maps.LatLng(place.y, place.x);
    map.setCenter(latLng); // 지도의 중심 이동
    const marker = new window.kakao.maps.Marker({
      position: latLng,
    });
    marker.setMap(map); // 마커를 맵에 설정

    onSelectLocation({
      name: place.place_name,
      latitude: parseFloat(place.y),
      longitude: parseFloat(place.x),
    });
  };

  // 검색 결과 클릭 시 해당 위치명이 아닌 행정 구역으로 변환
  const handleResultClick = (place) => {
    const latLng = new window.kakao.maps.LatLng(place.y, place.x);
    map.setCenter(latLng); // 지도의 중심 이동

    const marker = new window.kakao.maps.Marker({
      position: latLng,
    });
    marker.setMap(map); // 마커를 맵에 설정

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2RegionCode(latLng.getLng(), latLng.getLat(), (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const locationName = result[0].address_name; // 행정 구역명 가져오기
        setLocationName(locationName); // 위치명 업데이트
        onSelectLocation({
          name: locationName,
          latitude: parseFloat(place.y),
          longitude: parseFloat(place.x),
        });
      }
    });
  };


  return (
    <div>
      {/* 검색 입력창과 버튼 */}
      <div className="search-bar">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="장소 검색"
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      {/* 검색 결과 목록 */}
      <div className="search-results">
        {searchResults.map((place) => (
          <div
            key={place.id}
            onClick={() => handleResultClick(place)}
            className="search-result-item"
          >
            {place.place_name}
          </div>
        ))}
      </div>

      {/* 지도 영역 */}
      <div id="kakao-map" className="kakao-map"></div>
    </div>
  );
}

export default KakaoMap;