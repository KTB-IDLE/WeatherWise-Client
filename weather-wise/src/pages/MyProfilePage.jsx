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
import { useNavigate } from "react-router-dom";

const MyProfilePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ nickname: "", serialId: "", level: null, point: null });
  const [rankingInfo, setRankingInfo] = useState({ currentUserRanking: null, currentUserLevel: null});
  const [missionCount, setMissionCount] = useState(0);
  const [expRange, setExpRange] = useState({ minExp: 0, maxExp: 100 }); // 초기 경험치 범위
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [nickname, setNickname] = useState("");

  // 1. 사용자 정보 가져오기 (닉네임, 이메일)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // 사용자 정보 API 호출
        const userInfoResponse = await AxiosInstance.get(`/v1/users/me`);
        setUserInfo(userInfoResponse.data);

        // 랭킹 정보 API 호출
        const rankingResponse = await AxiosInstance.get(`/ranking`);
        setRankingInfo(rankingResponse.data.result);

        // 완료한 미션 개수 API 호출
        const missionResponse = await AxiosInstance.get(`/mission-histories/success`);
        setMissionCount(missionResponse.data.result.missionList.length);

        // 경험치 범위 가져오기
        if (userInfoResponse.data.level) {
          const expResponse = await AxiosInstance.get(`/exp`, { params: { level: userInfoResponse.data.level } });
          setExpRange(expResponse.data.result);
        }

        console.log("사용자 정보!!! :", userInfoResponse.data); // 전체 UserInfo 데이터 콘솔에 출력
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
      await AxiosInstance.put(url, nickname, {
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

  // 프로그레스 바 퍼센티지 계산
  const calculateProgress = () => {
    const { point } = userInfo;
    const { minExp, maxExp } = expRange;
    return point ? ((point - minExp) / (maxExp - minExp)) * 100 : 0;
  };

  return (
    <div className="profile-page">
      {/* 헤더 */}
      <Header
        leftChild={<Button text={<img src={left} alt="Back" />} type="icon" />}
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

      <div className="profile-header">
        <img src={profileIcon} alt="Profile" className="profile-icon" />
        <div className="profile-info">
          <div className="nickname-level">
            <span className="nickname">
              {userInfo.nickname || "닉네임 없음"}
            </span>{" "}
            {/* 1. 닉네임 표시 */}
            <span className="level">
              LEVEL {userInfo.level || "없음"} <span className="rank">({rankingInfo.currentUserRanking || "알 수 없음"}위)</span>
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${calculateProgress()}%` }}></div>
          </div>
          <div className="exp-info">
            완료한 미션 수: {missionCount}개 <span className="points">{userInfo.point !== undefined ? userInfo.point : "없음"} / {expRange.maxExp}</span>
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
      <div className="copy-right">
        <a href="https://www.flaticon.com/kr/free-icons/" title="동전 아이콘">동전 아이콘 제작자: Freepik - Flaticon</a> <br></br>
        <a href="https://www.flaticon.com/kr/free-icons/" title="로봇 아이콘">로봇 아이콘 제작자: Freepik - Flaticon</a><br></br>
        <a href="https://www.flaticon.com/kr/free-icons/-" title="일기 예보 아이콘">일기 예보 아이콘 제작자: Freepik - Flaticon</a>
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
