import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate를 react-router-dom에서 불러옵니다.
import "./Header.css";

const Header = ({ title, leftChild, rightChild }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 뒤로가기 기능
  };

  return (
    <header className="Header">
      <div className="header_left" onClick={handleBack}>
        {leftChild}
      </div>
      <div className="header_center">{title}</div>
      <div className="header_right">{rightChild}</div>
    </header>
  );
};

export default Header;
