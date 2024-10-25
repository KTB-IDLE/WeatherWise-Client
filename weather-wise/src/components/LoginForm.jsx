import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css"; // 스타일을 위한 CSS 파일
import kakao from "../assets/kakao.png";

const LoginForm = () => {
  const navigate = useNavigate();
  const [serialId, setSerialId] = useState(""); // serialId <-> email 상태
  const [password, setPassword] = useState(""); // password 상태

  // .env 파일의 VITE_API_BASE_URL을 환경변수에서 가져옴
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 로그인 버튼을 눌렀을 때 실행되는 함수
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/v1/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serialId,
          password,
        }),
      });

      const data = await response.json();
      if (data.code === "success") {
        // 로그인 성공 처리: 필요에 따라 다른 동작 추가
        alert("로그인 성공!");
        // 예시로 홈 화면으로 리다이렉트
        navigate("/");
      } else {
        alert(data.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  // 카카오 로그인 버튼을 눌렀을 때 실행되는 함수
  const handleKakaoLogin = () => {
    window.location.href = `${API_BASE_URL}/authorization/kakao`;
  };

  // 가입하기 버튼을 눌렀을 때 실행되는 함수
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
            placeholder="이메일"
            value={serialId}
            onChange={(e) => setSerialId(e.target.value)} // serialId 상태 업데이트
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            className="login-input"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // password 상태 업데이트
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
