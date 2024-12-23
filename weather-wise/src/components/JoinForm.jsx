// JoinForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JoinForm.css";
import Modal from "./Modal";

const JoinForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickName] = useState("");
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 닉네임이 숫자로만 이루어져 있는지 확인
    const isNumeric = /^\d+$/.test(nickname);
    if (isNumeric) {
      setError("닉네임은 숫자로만 구성될 수 없습니다.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/users/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // JSON 데이터임을 명시
          },
          body: JSON.stringify({
            serialId: email,
            nickname,
            password,
          }),
        }
      );

      if (response.ok) {
        setIsModalOpen(true); // 회원가입 성공 시 모달 열기
      } else {
        const errorData = await response.json();
        console.log("회원가입 실패:", errorData);
        setError(errorData.error.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 요청 실패:", error);
      setError("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/login"); // 모달을 닫으며 로그인 페이지로 이동
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <div className="input-group">
          <input
            className="signup-input"
            placeholder="아이디"
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
            onChange={(e) => setNickName(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="signup-button">
          회원가입
        </button>
      </form>

      {/* 회원가입 성공 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        message="회원가입 성공"
      />
    </div>
  );
};

export default JoinForm;
