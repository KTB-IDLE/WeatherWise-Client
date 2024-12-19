import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css"; // 스타일을 위한 CSS 파일
import kakao from "../assets/kakao.png";

const LoginForm = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const VITE_API_BASE_URL_FOR_OAUTH = import.meta.env
    .VITE_API_BASE_URL_FOR_OAUTH;
  const navigate = useNavigate();
  const [serialId, setSerialId] = useState("");
  const [password, setPassword] = useState("");

  // 쿠키에서 특정 이름의 쿠키 값을 찾는 함수
  const parseCookie = (name) => {
    const cookies = document.cookie.split("; ");
    const foundCookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return foundCookie ? foundCookie.split("=")[1] : null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("serialId", serialId);
    formData.append("password", password);

    try {
      console.log(import.meta.env.VITE_API_BASE_URL);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/sign-in`,
        {
          method: "POST",
          credentials: "include", // 쿠키를 포함하도록 설정
          body: formData,
        }
      );

      const result = await response.text();

      if (result.trim() === "OK") {
        navigate("/");
        // 쿠키에서 accessToken과 refreshToken 값 가져오기
        const accessToken = parseCookie("accessToken");
        // https 환경에서만 실행 가능
        const refreshToken = parseCookie("refreshToken");
      } else {
        alert("로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = `${VITE_API_BASE_URL_FOR_OAUTH}/oauth2/authorization/kakao`;
  };

  const handleRegister = () => {
    navigate("/join");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="text"
            className="login-input"
            placeholder="아이디"
            value={serialId}
            onChange={(e) => setSerialId(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            className="login-input"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          로그인
        </button>
        <div className="divider">
          <span>또는</span>
        </div>
        <button
          type="button"
          className="kakao-login-button"
          onClick={handleKakaoLogin}
        >
          <img src={kakao} alt="kakao-login" className="kakao-login-icon" />
          카카오 로그인
        </button>
      </form>
      <div className="register-link">
        계정이 없으신가요?{" "}
        <a href="#!" onClick={handleRegister}>
          가입하기
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
