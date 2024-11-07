import React, { useState, useEffect } from 'react';
import KakaoMap from './KakaoMap';
import locationIcon from '../../assets/location.png';
import './LocationSelectPost.css';

function LocationSelectPost({ location, setLocation }) {
  const [showMap, setShowMap] = useState(false);

  const defaultLocation = {
    name: '대치동 (기본위치)',
    latitude: 37.499920,
    longitude: 127.037840,
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const shortAddress = result[0].region_3depth_name || result[0].address_name;
              setLocation({ name: shortAddress, latitude, longitude });
            }
          });
        },
        () => {
          setLocation(defaultLocation);
        }
      );
    } else {
      setLocation(defaultLocation);
    }
  }, [setLocation]);

  const handleLocationChange = (newLocation) => {
    const { latitude, longitude } = newLocation;
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const shortAddress = result[0].region_3depth_name || result[0].address_name;
        setLocation({ name: shortAddress, latitude, longitude });
      }
    });
    setShowMap(false);
  };

  return (
    <div className="location-select-post">
      <span className="location-name">{location.name || '위치 가져오는 중...'}</span>
      <button
        className="location-button"
        onClick={() => setShowMap(!showMap)}
      >
        <img src={locationIcon} alt="location icon" />
      </button>

      {showMap && (
        <KakaoMap
          onSelectLocation={handleLocationChange}
          defaultLocation={location || defaultLocation}
          className="location-select-community"
        />
      )}
    </div>
  );
}

export default LocationSelectPost;
