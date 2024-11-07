// src/utils/axiosInstance.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 쿠키를 자동으로 포함
});

// 요청 인터셉터 추가
AxiosInstance.interceptors.request.use(
  (config) => {
    // accessToken 쿠키 가져오기
    const cookies = document.cookie.split("; ");
    const accessToken = cookies
      .find((cookie) => cookie.startsWith("accessToken="))
      ?.split("=")[1];

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 추가: 401 Unauthorized 처리
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 에러 시 accessToken을 제거하고 로그인 페이지로 리다이렉트
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/login"; // 로그인 페이지로 리다이렉트
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
