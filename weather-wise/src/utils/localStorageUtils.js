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
  const dataToCache = {
    postData,
    timestamp: Date.now(),
  };

  localStorage.setItem(key, JSON.stringify(dataToCache));
};
