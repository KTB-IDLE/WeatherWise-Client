// src/components/ChatbotButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import chatbotIcon from "../assets/chatbot_button_icon.png"; // 챗봇 버튼 이미지
import "./ChatbotButton.css"; // 챗봇 버튼 CSS

const ChatbotButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chatbot");
  };

  return (
    <img
      src={chatbotIcon}
      alt="Chatbot Button"
      className="chatbot-button"
      onClick={handleClick}
    />
  );
};

export default ChatbotButton;
