import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import ChattingInfo from "../components/ChattingInfo";
import { Client } from "@stomp/stompjs"; // STOMP 클라이언트 라이브러리
import { useParams, useNavigate } from "react-router-dom"; // 추가: navigate 사용
import "./Chatting.css";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";

const Chatting = () => {
  const { chatRoomId } = useParams(); // URL에서 채팅방 ID 가져오기
  const navigate = useNavigate(); // 페이지 이동 함수
  const [userId] = useState("내가바로에코왕"); // 사용자 ID (하드코딩 예시)
  const [chatContents, setChatContents] = useState([]); // 채팅 메시지 상태
  const [message, setMessage] = useState(""); // 입력 메시지 상태
  const chatBodyRef = useRef(null); // 채팅 스크롤 참조
  const stompClient = useRef(null); // STOMP 클라이언트 참조

  // WebSocket 및 STOMP 설정
  const SOCKET_URL = "ws://localhost:8080/ws/chat"; // WebSocket 엔드포인트
  const TOKEN =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1aWQiOiIyIiwicm9sIjoiVVNFUiIsImlhdCI6MTczMzIxNzMwMSwiZXhwIjoxNzM0NjI3MzY2fQ.LUKd9_0XVt8W1lYEHna30nDclgrMyAR5IiwTRF8CKId3_xJJjWwqghNdcwRg0cHAm1dAUTDj8In4UHz3sturXg";

  useEffect(() => {
    // WebSocket 및 STOMP 클라이언트 초기화
    stompClient.current = new Client({
      brokerURL: SOCKET_URL, // WebSocket URL
      connectHeaders: {
        Authorization: `Bearer ${TOKEN}`, // STOMP 연결 헤더에 JWT 포함
      },
      debug: (str) => console.log("STOMP DEBUG:", str), // 디버깅 로그
      reconnectDelay: 5000, // 연결 실패 시 재시도 지연 시간 (ms)
      onConnect: () => {
        console.log("WebSocket 연결 성공");

        // STOMP 구독 설정
        stompClient.current.subscribe(`/topic/chatroom/1`, (message) => {
          const payload = JSON.parse(message.body); // 받은 메시지 JSON 파싱
          setChatContents((prevContents) => [...prevContents, payload]); // 메시지 추가
        });
      },
      onStompError: (frame) => {
        console.error("STOMP 에러:", frame.headers["message"]);
      },
    });

    stompClient.current.activate(); // STOMP 클라이언트 활성화

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [chatRoomId]); // 채팅방 ID 변경 시 재설정

  useEffect(() => {
    // 새 메시지가 추가되면 스크롤을 맨 아래로 이동
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatContents]);

  const sendMessage = () => {
    if (message.trim() && stompClient.current) {
      const chatMessage = {
        content: message, // 메시지 내용
        chatRoomId, // 현재 채팅방 ID
        userId, // 현재 사용자 ID
      };

      // STOMP를 통해 메시지 전송
      stompClient.current.publish({
        destination: `/app/chat.sendMessage/${chatRoomId}`, // 메시지 전송 경로
        headers: {
          Authorization: `Bearer ${TOKEN}`, // JWT 포함
        },
        body: JSON.stringify(chatMessage), // 메시지 JSON 포맷으로 전송
      });

      setMessage(""); // 입력 메시지 초기화
    }
  };

  return (
    <>
      {/* 상단 헤더 */}
      <Header
        title={<img src={mainLogo} alt="mainLogo" />}
        rightChild={
          <div>
            <Button
              text={<img src={info} alt="info" />}
              type="icon"
              onClick={() => navigate("/myprofile")} // 프로필 페이지 이동
            />
          </div>
        }
      />

      {/* 채팅방 정보 */}
      <ChattingInfo />

      {/* 채팅 UI */}
      <div className="chat-container">
        <div className="chat-body" ref={chatBodyRef}>
          {chatContents.map((content, index) => (
            <div
              key={index}
              className={`message ${
                content.userId === userId ? "own-message" : "other-message"
              }`}
            >
              <p className="message-user">{content.userId}</p>
              <div className="message-content">
                <p>{content.content}</p>
                <span className="message-time">{content.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 입력창 및 전송 버튼 */}
        <div className="chat-footer">
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Enter 키로 메시지 전송
          />
          <button onClick={sendMessage}>전송</button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Chatting;
