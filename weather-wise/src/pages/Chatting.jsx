import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import ChattingInfo from "../components/ChattingInfo";
import "./Chatting.css";

const Chatting = () => {
  const [userId] = useState("내가바로에코왕"); // 현재 사용자 ID
  const [chatContents, setChatContents] = useState([]); // 메시지 상태
  const chatBodyRef = useRef(null); // 스크롤 제어를 위한 참조

  // 정적인 채팅 데이터
  const staticMessages = [
    { userId: "아이들1", message: "오늘 지이이인짜 덥다.", timestamp: "22:50" },
    { userId: "아이들2", message: "오늘 정말 덥다.", timestamp: "22:52" },
    { userId: "내가바로에코왕", message: "공감합니다..", timestamp: "22:55" },
    { userId: "내가바로에코왕", message: "공감합니다..", timestamp: "22:55" },
    { userId: "내가바로에코왕", message: "공감합니다..", timestamp: "22:55" },
    { userId: "내가바로에코왕", message: "공감합니다..", timestamp: "22:55" },
  ];

  useEffect(() => {
    // 스크롤을 항상 맨 아래로 설정
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatContents]); // 메시지가 변경될 때마다 스크롤 이동

  useEffect(() => {
    // 초기 메시지를 상태에 설정
    setChatContents(staticMessages);
  }, []);

  return (
    <>
      <Header
        leftChild={<Button text={<img src={left} alt="Back" />} type="icon" />}
        title={<img src={mainLogo} alt="mainLogo" />}
        rightChild={
          <div>
            <Button
              text={<img src={info} alt="info" />}
              type="icon"
              onClick={() => alert("프로필 페이지 이동")}
            />
          </div>
        }
      />

      {/* ChattingInfo 컴포넌트 추가 */}
      <ChattingInfo />

      <div className="chat-container">
        <div className="chat-body" ref={chatBodyRef}>
          {/* 메시지 리스트 */}
          {chatContents.map((content, index) => (
            <div
              key={index}
              className={`message ${
                content.userId === userId ? "own-message" : "other-message"
              }`}
            >
              <p className="message-user">{content.userId}</p>
              <div className="message-content">
                <p>{content.message}</p>
                <span className="message-time">{content.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 메시지 입력란 비활성화 */}
        <div className="chat-footer">
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            disabled
            value=""
          />
          <button disabled>전송</button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Chatting;
