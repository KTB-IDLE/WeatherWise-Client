import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Button from "../components/Button";
import Footer from "../components/Footer";
import AxiosInstance from "../utils/AxiosInstance";
import Header from "../components/Header";
import Loading from "./Loading";
import leftIcon from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import "./Chatting.css";
import { v4 as uuidv4 } from "uuid"; // uuid를 사용하여 고유 ID 생성

// 쿠키에서 특정 이름의 값을 가져오는 함수
const getCookie = (cookieName) => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === cookieName) {
      return decodeURIComponent(value);
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
  const [participants, setParticipants] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const stompClientRef = useRef(null);
  const lastMessageRef = useRef(null); // 마지막 메시지에 대한 ref 생성

  const { chatRoomName } = location.state || {};

  // 한글 IME 입력 처리
  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  // DOM 업데이트 후 실행하여 마지막 메시지로 스크롤 이동
  useLayoutEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatContents]);

  // 메시지 중복 여부 확인
  const isDuplicateMessage = (messageId) => {
    return chatContents.some((msg) => msg.id === messageId);
  };

  // 1) Fetch nickname
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const res = await AxiosInstance.get("/v1/users/nickname");
        setNickname(res.data);
      } catch (error) {
        console.error("Failed to fetch nickname:", error);
      }
    };
    fetchNickname();
  }, []);

  // 2) Fetch initial messages
  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        const res = await AxiosInstance.get(`/chats/${chatRoomId}/recent`);
        setChatContents(res.data);
      } catch (error) {
        console.error("Failed to fetch initial messages:", error);
      }
    };
    fetchInitialMessages();
  }, [chatRoomId]);

  // 3) STOMP connection
  useEffect(() => {
    stompClientRef.current = new Client({
      brokerURL: import.meta.env.VITE_API_CHAT_URL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log("STOMP DEBUG:", str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("STOMP connected");
        setIsLoading(false);

        // Subscribe to chat messages
        stompClientRef.current.subscribe(
          `/topic/chatroom/${chatRoomId}`,
          (msg) => {
            const payload = JSON.parse(msg.body);

            // 중복 메시지 필터링
            if (!isDuplicateMessage(payload.id)) {
              setChatContents((prev) => [...prev, payload]);
            }
          },
          {
            Authorization: `Bearer ${token}`,
          }
        );

        // Subscribe to participant count
        stompClientRef.current.subscribe(
          `/topic/chatroom/${chatRoomId}/participants`,
          (msg) => {
            const count = JSON.parse(msg.body);
            setParticipants(count);
          },
          { Authorization: `Bearer ${token}` }
        );

        // Send enter room message
        stompClientRef.current.publish({
          destination: `/app/chat.enterRoom/${chatRoomId}`,
          body: JSON.stringify({}),
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
    });

    stompClientRef.current.activate();

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.publish({
          destination: `/app/chat.exitRoom/${chatRoomId}`,
          body: JSON.stringify({}),
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
        });
        stompClientRef.current.deactivate();
      }
    };
  }, [chatRoomId, token]);

  // 메시지 전송 함수
  const sendMessage = () => {
    if (!message.trim() || isComposing) return;

    const chatMessage = {
      id: uuidv4(), // 고유 메시지 ID 생성
      chatRoomId: parseInt(chatRoomId, 10),
      message,
      nickname,
      // timestamp: new Date().toISOString(), // 서버에서 타임스탬프를 관리하므로 제거
    };

    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: `/app/chat.sendMessage/${chatRoomId}`,
        body: JSON.stringify(chatMessage),
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
      });

      // 메시지를 서버로 전송한 후 로컬 상태에 추가하지 않음
      setMessage("");
    } else {
      console.error("STOMP client is not connected.");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="chatbot-page">
      <Header
        leftChild={
          <Button
            text={<img src={leftIcon} alt="Back" />}
            type="icon"
            onClick={() => navigate(-1)}
          />
        }
        title={`${chatRoomName || "채팅방"} (${participants}명)`} // 방 이름과 참여자 수를 함께 표시
        disableTitleClick={true}
      />
      <div className="chat-window">
        <div className="messages">
          {chatContents.map((content, index) => {
            const isOwn = content.nickname === nickname;
            const isLastMessage = index === chatContents.length - 1;
            return (
              <div
                key={content.id}
                className={`message ${isOwn ? "own" : "other"}`}
              >
                <div className="message-wrapper">
                  <p className="message-nickname">{content.nickname}</p>
                  <div className="message-text">
                    <p>{content.message}</p>
                    <span className="message-time">
                      {formatTime(content.timestamp)}
                    </span>
                  </div>
                </div>
                {isLastMessage && <div ref={lastMessageRef} />}{" "}
                {/* 마지막 메시지에 ref 적용 */}
              </div>
            );
          })}
        </div>
        <div className="input-area">
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyDown={handleKeyDown}
          />
          <button onClick={sendMessage}>전송</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chatting;
