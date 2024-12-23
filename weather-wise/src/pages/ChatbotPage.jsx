// src/pages/ChatbotPage.jsx
import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import left from "../assets/left.png";
import chatrobot from "../assets/chatrobot.png";
import "./ChatbotPage.css"; // 채팅방 CSS
import { useNavigate } from "react-router-dom";

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]); // 채팅 메시지 목록
  const [input, setInput] = useState(""); // 입력 필드 상태
  const messagesEndRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL;

  // 스크롤을 항상 최신 메시지로 이동
  const scrollToBottom = () => {
    if (messages.length > 6 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 가짜 AI API 호출
  const sendMessageToAI = async (userMessage) => {
    try {
        const response = await fetch(`${API_BASE_URL}/ai/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_message: userMessage }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch AI response");
        }
  
        const data = await response.json();
        return data.response; // FastAPI에서 반환한 응답 메시지
      } catch (error) {
        console.error("AI API 호출 오류:", error);
        return "죄송합니다. AI와 연결할 수 없습니다. 나중에 다시 시도해 주세요.";
      }
    };
  

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessage = { sender: "user", text: input.trim() };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");

    // AI 응답 받기
    const aiResponse = await sendMessageToAI(input.trim());
    const aiMessage = { sender: "ai", text: aiResponse };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chatbot-page">
      <Header
        leftChild={
          <Button
            text={<img src={left} alt="Back" />}
            type="icon"
            onClick={() => navigate("/")}
          />
        }
        title={<img src={chatrobot} alt="chatrobot" />}
      />
      <div className="chat-window">
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "ai" ? "ai" : "user"}`}
            >
              <div className="message-text">{msg.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area">
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSend}>전송</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChatbotPage;
