import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AxiosInstance from "../utils/AxiosInstance";
import Footer from "../components/Footer";
import mainLogo from "../assets/mainLogo.png";
import Button from "../components/Button";
import info from "../assets/info.png";
import "./ChatList.css";

const ChatList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { locationData } = location.state || {};

  // 위도, 경도 기본값 (서울)
  const latitude = locationData?.latitude || 37.5665;
  const longitude = locationData?.longitude || 126.978;

  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [joiningRoomId, setJoiningRoomId] = useState(null); // 현재 가입 중인 채팅방 ID

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await AxiosInstance.get("/chat-list", {
          params: { latitude, longitude },
        });
        setChatRooms(response.data);
        console.log("위치 =", latitude, longitude);
        console.log("response =", response);
      } catch (err) {
        console.error("오류 발생:", err);
        setError("데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchChatRooms();
    }
  }, [latitude, longitude]);

  const handleJoinChatRoom = async (chatRoomId, chatRoomName) => {
    try {
      setJoiningRoomId(chatRoomId); // 가입 중인 채팅방 ID 설정
      await AxiosInstance.post(`/chat/${chatRoomId}/members/join`);
      // 가입 성공 시 채팅방으로 이동
      navigate(`/chat/${chatRoomId}`, {
        state: { chatRoomName: chatRoomName },
      });
    } catch (err) {
      console.error("채팅방 가입 오류:", err);
      alert("채팅방에 가입하는 데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setJoiningRoomId(null); // 가입 상태 초기화
    }
  };

  if (loading) return <div className="chatlist-loading">불러오는 중...</div>;
  if (error) return <div className="chatlist-error">{error}</div>;

  return (
    <div className="chatlist-container">
      <Header
        title={<img src={mainLogo} alt="mainLogo" />}
        rightChild={
          <div>
            <Button
              text={<img src={info} alt="info" />}
              type="icon"
              onClick={() => navigate("/myprofile")}
            />
          </div>
        }
      />

      <h2 className="chatlist-title">기상특보 오픈 채팅방</h2>

      <div className="chat-room-list">
        {chatRooms.length > 0 ? (
          chatRooms.map((chatRoom) => (
            <div
              className="chat-room-item"
              key={chatRoom.id}
              onClick={() => handleJoinChatRoom(chatRoom.id, chatRoom.name)}
            >
              <div className="chat-room-title">{chatRoom.name}</div>
              <div className="chat-room-subinfo">
                <span>지역: {chatRoom.parentRegionName}</span>
              </div>
              {joiningRoomId === chatRoom.id && (
                <div className="joining-indicator">가입 중...</div>
              )}
            </div>
          ))
        ) : (
          <p className="chatlist-no-data">특보 데이터가 없습니다.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ChatList;
