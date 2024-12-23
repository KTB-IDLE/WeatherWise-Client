import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate를 react-router-dom에서 불러옵니다.
import "./Header.css";

const Header = ({ title, leftChild, rightChild, onLeftClick, disableTitleClick }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 뒤로가기 기능
  };

  const handleHome = () => {
    navigate("/"); // 홈으로 이동
  };

  return (
    <header className="Header">
      <div 
      className="header_left" 
      onClick={onLeftClick ? onLeftClick : handleHome} 
      >
        {leftChild}
      </div>
      <div 
        className="header_center" 
        onClick={!disableTitleClick ? handleHome : undefined} // disableTitleClick이 true면 클릭 비활성화
      >
        {title}
      </div>
      <div className="header_right">{rightChild}</div>
    </header>
  );
};

export default Header;
