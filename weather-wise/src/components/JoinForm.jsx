import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JoinForm.css"; // 스타일을 위한 CSS 파일
import Modal from "./Modal"; // 모달 컴포넌트 임포트

const JoinForm = () => {
  const navigate = useNavigate();

  // 입력 필드에 대한 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

  // .env 파일의 VITE_API_BASE_URL을 환경변수에서 가져옴
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 회원가입 버튼을 눌렀을 때 실행되는 함수
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 서버로 회원가입 요청 보내기
    try {
      const response = await fetch(`${API_BASE_URL}/v1/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serialId: email, // email 대신 serialId 사용
          password,
          nickname,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 회원가입 성공 시 모달을 열도록 설정
        setIsModalOpen(true);
      } else {
        setError(data.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  // 모달을 닫고 로그인 페이지로 이동하는 함수
  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
    navigate("/login"); // 로그인 페이지로 이동
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <div className="input-group">
          <input
            type="email"
            className="signup-input"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            className="signup-input"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            className="signup-input"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            className="signup-input"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>

        {/* 오류 메시지 출력 */}
        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="signup-button">
          회원가입
        </button>
      </form>

      {/* 모달 컴포넌트 렌더링 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        message="회원가입이 성공적으로 완료되었습니다!"
      />
    </div>
  );
};

export default JoinForm;
