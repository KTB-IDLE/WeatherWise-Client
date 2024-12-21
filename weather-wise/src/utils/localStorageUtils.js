// utils/localStorageUtils.js
export const getCachedWeather = (key) => {
  const cachedData = localStorage.getItem(key);
  if (!cachedData) return null;

  const { weatherData, timestamp } = JSON.parse(cachedData);
  // 데이터 유효시간 : 1시간
  const oneHour = 1000 * 60 * 60;

  if (Date.now() - timestamp > oneHour) {
    // 데이터가 1시간 이상 되었으면 만료
    localStorage.removeItem(key);
    return null;
  }

  return weatherData; // 유효한 데이터 반환
};

export const setCachedWeather = (key, weatherData) => {
  const dataToCache = {
    weatherData,
    timestamp: Date.now(),
  };

  localStorage.setItem(key, JSON.stringify(dataToCache));
};

export const getCachedPost = (key) => {
  const cachedData = localStorage.getItem(key);
  if (!cachedData) return null;

  const { postData, timestamp } = JSON.parse(cachedData);
  // 데이터 유효시간 : 1시간
  const oneHour = 1000 * 60 * 60;

  if (Date.now() - timestamp > oneHour) {
    // 데이터가 1시간 이상 되었으면 만료
    localStorage.removeItem(key);
    return null;
  }

  return postData; // 유효한 데이터 반환
};

export const setCachedPost = (key, postData) => {
  // 기존 캐시 데이터 가져오기
  const existingData = JSON.parse(localStorage.getItem(key)) || {};

  // 기존 데이터에서 latitude와 longitude 제거
  const { latitude, longitude, ...rest } = existingData.postData || {};

  // 새로 저장할 데이터 준비
  const dataToCache = {
    postData,
    timestamp: Date.now(),
  };

  // 데이터 저장
  localStorage.setItem(key, JSON.stringify(dataToCache));
};
