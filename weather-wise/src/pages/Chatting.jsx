import React, { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import Footer from "../components/Footer";
import AxiosInstance from "../utils/AxiosInstance";
import Header from "../components/Header";
import Loading from "./Loading";
import info from "../assets/info.png";
import leftIcon from "../assets/left.png"; // left.png 이미지 가져오기
import mainLogo from "../assets/mainLogo.png";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import "./Chatting.css";

// 쿠키에서 특정 이름의 값을 가져오는 함수
const getCookie = (cookieName) => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === cookieName) {
      return value;
    }
  }
  return null;
};

// "2024-12-21T23:18:24.22352" → "23:18" 형태로 변환
const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${formattedMinutes}`;
};

const Chatting = () => {
  const { chatRoomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const token = getCookie("accessToken");

  const [nickname, setNickname] = useState("");
  const [chatContents, setChatContents] = useState([]);
  const [message, setMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [participants, setParticipants] = useState(0); // 참여자 수 state
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const chatBodyRef = useRef(null);
  const stompClientRef = useRef(null);

  const { chatRoomName } = location.state || {};

  // 1) 내 닉네임 불러오기
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const res = await AxiosInstance.get("/v1/users/nickname");
        setNickname(res.data);
      } catch (error) {
        console.error("닉네임 불러오기 실패:", error);
      }
    };
    fetchNickname();
  }, []);

  // 2) 초기 메시지 불러오기
  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        const res = await AxiosInstance.get(`/chats/${chatRoomId}/recent`);
        setChatContents(res.data);
      } catch (error) {
        console.error("초기 메시지 불러오기 실패:", error);
      }
    };
    fetchInitialMessages();
  }, [chatRoomId]);

  // 3) STOMP 연결 + 입장 메시지 전송
  useEffect(() => {
    stompClientRef.current = new Client({
      brokerURL: "ws://localhost:8080/ws/chat",
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log("STOMP DEBUG:", str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("STOMP 연결 성공");
        setIsLoading(false); // 로딩 상태 해제

        // 채팅 메시지 구독
        stompClientRef.current.subscribe(
          `/topic/chatroom/${chatRoomId}`,
          (msg) => {
            const payload = JSON.parse(msg.body);
            console.log("수신된 메시지:", payload);

            // 내 메시지 => 중복 표시 방지
            if (payload.nickname === nickname) {
              return;
            }
            // 상대 메시지 => state에 추가
            setChatContents((prev) => [...prev, payload]);
          },
          {
            Authorization: `Bearer ${token}`,
          }
        );

        // 참여자 수 구독
        stompClientRef.current.subscribe(
          `/topic/chatroom/${chatRoomId}/participants`,
          (msg) => {
            const count = JSON.parse(msg.body);
            console.log("현재 인원수:", count);
            setParticipants(count);
          },
          { Authorization: `Bearer ${token}` }
        );

        // 채팅방에 입장했다고 알림
        stompClientRef.current.publish({
          destination: `/app/chat.enterRoom/${chatRoomId}`,
          body: JSON.stringify({
            /* 필요하면 값 전달 */
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
        });
      },
      onStompError: (frame) => {
        console.error("STOMP 연결 오류:", frame.headers["message"]);
      },
    });

    stompClientRef.current.activate();

    // 컴포넌트 언마운트 시 퇴장 메시지 전송
    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.publish({
          destination: `/app/chat.exitRoom/${chatRoomId}`,
          body: JSON.stringify({
            /* 필요하면 값 전달 */
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
        });
        stompClientRef.current.deactivate();
      }
    };
  }, [chatRoomId, token, nickname]);

  // 4) 채팅창 스크롤 유지
  useEffect(() => {
    const scrollToBottom = () => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight; // 항상 맨 아래로 스크롤
      }
    };

    scrollToBottom(); // 메시지 추가 시 호출
  }, [chatContents]); // chatContents가 변경될 때마다 실행

  // 5) 메시지 전송
  const sendMessage = () => {
    if (!message.trim() || isComposing) return;

    if (stompClientRef.current && stompClientRef.current.connected) {
      const chatMessage = {
        chatRoomId: parseInt(chatRoomId, 10),
        message: message,
        nickname: nickname,
      };

      stompClientRef.current.publish({
        destination: `/app/chat.sendMessage/${chatRoomId}`,
        body: JSON.stringify(chatMessage),
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
      });

      // 내 메시지를 로컬에서 즉시 표시(오른쪽)
      setChatContents((prev) => [
        ...prev,
        { ...chatMessage, timestamp: new Date().toISOString() },
      ]);

      setMessage("");
    } else {
      console.error("STOMP 클라이언트가 연결되지 않았습니다.");
    }
  };

  // 6) 한글 IME + Enter 처리
  const handleChange = (e) => setMessage(e.target.value);
  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoading) {
    return <Loading />; // 로딩 상태일 때 로딩 화면 표시
  }

  return (
    <>
      <div className="main-content">
        <div className="header-row">
          {/* 뒤로가기 버튼 */}
          <button
            className="back-button"
            onClick={() => navigate(-1)} // 뒤로가기 동작 구현
          >
            <img src={leftIcon} alt="뒤로가기" className="back-icon" />
          </button>
          <h1 className="chat-title">
            {chatRoomName || `채팅방 #${chatRoomId}`}
          </h1>
        </div>
        <p>현재 참여자: {participants}명</p>
      </div>
      <div className="chat-container">
        <div className="chat-body" ref={chatBodyRef}>
          {chatContents.map((content, idx) => {
            // 시:분 포맷
            const displayTime = formatTime(content.timestamp);

            return (
              <div
                key={idx}
                className={`message ${
                  content.nickname === nickname
                    ? "own-message"
                    : "other-message"
                }`}
              >
                <p className="message-user">
                  {content.nickname && content.nickname.length > 0
                    ? content.nickname
                    : "익명"}
                </p>
                <div className="message-content">
                  <p>{content.message}</p>
                  {/* 시:분 형태 표시 */}
                  <span className="message-time">{displayTime}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="chat-footer">
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={handleChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyDown={handleKeyDown}
          />
          <button type="button" onClick={sendMessage}>
            전송
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Chatting;
