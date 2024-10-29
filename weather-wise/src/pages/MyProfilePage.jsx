import React, { useState, useEffect } from "react";
import AxiosInstance from "../utils/AxiosInstance";
import profileIcon from "../assets/myinfo.png";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import "./MyProfilePage.css";

const MyProfilePage = () => {
  const [userInfo, setUserInfo] = useState({ nickname: "", serialId: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [nickname, setNickname] = useState("");

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const accessToken = import.meta.env.VITE_API_ACCESS_TOKEN;

  // 1. 사용자 정보 가져오기 (닉네임, 이메일)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const url = `/v1/users/me`;
        const response = await AxiosInstance.get(url);
        setUserInfo(response.data); // 받아온 사용자 정보를 상태에 저장
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      }
    };
    fetchUserInfo();
  }, []);

  // 닉네임 변경 팝업
  const handleNicknameChange = async () => {
    try {
      const url = `/v1/users/nickname`;
      const response = await AxiosInstance.put(url, nickname, {
        headers: { "Content-Type": "text/plain" },
      });
      setPopupContent("닉네임 변경이 완료되었습니다.");

      setUserInfo((prevInfo) => ({
        ...prevInfo,
        nickname: nickname, // 새로 입력한 닉네임으로 상태 업데이트
      }));
    } catch (error) {
      setPopupContent("닉네임 변경 실패: " + error.message);
    }
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      const url = "/v1/logout";
      await AxiosInstance.post(url);
      window.location.href = "/"; // 로그아웃 후 메인페이지 이동
    } catch (error) {
      setPopupContent("로그아웃 실패: " + error.message);
    }
  };

  // 회원 탈퇴 처리
  const handleDeleteUser = async () => {
    try {
      const url = `/v1/users/delete`;
      await AxiosInstance.delete(url);
      window.location.href = "/"; // 탈퇴 후 메인페이지 이동
    } catch (error) {
      setPopupContent("회원 탈퇴 실패: " + error.message);
    }
  };

  return (
    <div className="profile-page">
      <Header
        leftChild={<Button text={<img src={left} alt="Back" />} type="icon" />}
        title={<img src={mainLogo} alt="mainLogo" />}
        rightChild={
          <Button
            text={<img src={info} alt="info" />}
            type="icon"
            onClick={() => console.log("Notification button clicked")}
          />
        }
      />

      <div className="profile-header">
        <img src={profileIcon} alt="Profile" className="profile-icon" />
        <div className="profile-info">
          <div className="nickname-level">
            <span className="nickname">
              {userInfo.nickname || "닉네임 없음"}
            </span>{" "}
            {/* 1. 닉네임 표시 */}
            <span className="level">
              LEVEL 12 <span className="rank">(랭킹 41%)</span>
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: "41%" }}></div>
          </div>
          <div className="exp-info">
            완료한 미션 수: 13개 <span className="points">470 / 1000</span>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h2>계정</h2>
        <ul>
          <li className="account-item">
            <span>아이디</span>
            <span className="email">
              {userInfo.serialId || "이메일 없음"}
            </span>{" "}
            {/* 2. 이메일(Serial ID) 표시 */}
          </li>
          <li
            onClick={() => {
              setShowPopup(true);
              setPopupContent("닉네임을 입력하세요:");
            }}
          >
            닉네임 변경
          </li>
          <li
            onClick={() => {
              setShowPopup(true);
              setPopupContent("로그아웃 하시겠습니까?");
            }}
          >
            로그아웃
          </li>
          <li
            onClick={() => {
              setShowPopup(true);
              setPopupContent("정말 탈퇴하시겠습니까?");
            }}
          >
            회원 탈퇴
          </li>
        </ul>
      </div>

      <div className="profile-section">
        <h2>커뮤니티</h2>
        <ul>
          <li onClick={() => (window.location.href = "/myposts")}>
            내가 작성한 글
          </li>
        </ul>
      </div>

      <Footer />

      {/* 팝업창 */}
      {showPopup && (
        <div className="popup">
          <p>{popupContent}</p>
          {popupContent.includes("닉네임을 입력하세요") && (
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          )}
          <button
            onClick={() => {
              if (popupContent.includes("닉네임을 입력하세요")) {
                handleNicknameChange().then(() => setShowPopup(false)); // 닉네임 변경 후 팝업 닫기
              } else if (popupContent.includes("로그아웃")) {
                handleLogout().then(() => setShowPopup(false)); // 로그아웃 후 팝업 닫기
              } else if (popupContent.includes("탈퇴")) {
                handleDeleteUser().then(() => setShowPopup(false)); // 탈퇴 후 팝업 닫기
              }
            }}
          >
            확인
          </button>
          <button onClick={() => setShowPopup(false)}>취소</button>
        </div>
      )}
    </div>
  );
};

export default MyProfilePage;
