import React, { useEffect, useState } from 'react';
import './KakaoMap.css';

function KakaoMap({ onSelectLocation, defaultLocation }) {
  const [map, setMap] = useState(null);

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
  }, [KAKAO_API_KEY, defaultLocation]);

  return <div id="kakao-map" className="kakao-map"></div>;
}

export default KakaoMap;
