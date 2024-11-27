import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../utils/AxiosInstance";
import LocationSelectPost from "../components/community/LocationSelectPost"; // 위치 선택 컴포넌트
import "./CreatePostPage.css";

function CreatePostPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState({
    name: "",
    latitude: null,
    longitude: null,
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(""); // 팝업 내용 설정

  // 제목과 내용의 최대 길이
  const TITLE_MAX_LENGTH = 20;
  const CONTENT_MAX_LENGTH = 150;

  // 제목 입력 핸들러
  const handleTitleChange = (e) => {
    if (e.target.value.length > TITLE_MAX_LENGTH) {
      setPopupContent(`제목은 최대 ${TITLE_MAX_LENGTH}글자까지만 입력 가능합니다.`);
      setShowPopup(true);
      return;
    }
    setTitle(e.target.value);
  };

  // 내용 입력 핸들러
  const handleContentChange = (e) => {
    if (e.target.value.length > CONTENT_MAX_LENGTH) {
      setPopupContent(`내용은 최대 ${CONTENT_MAX_LENGTH}글자까지만 입력 가능합니다.`);
      setShowPopup(true);
      return;
    }
    setContent(e.target.value);
  };

  const createPost = async () => {
    // 제목, 내용, 위치 필드가 모두 채워져 있는지 확인
    if (!title || !content || !location.name) {
      setPopupContent("제목, 내용, 위치를 모두 입력해주세요.");
      setShowPopup(true);
      return;
    }

    try {
      const url = `/boards`;
      const response = await AxiosInstance.post(url, {
        title,
        content,
        locationRequest: {
          locationName: location.name,
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });
      console.log("글 작성 성공:", response.data);
      navigate("/community");
    } catch (error) {
      console.error("글 작성 오류:", error);
      setPopupContent("글 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
      setShowPopup(true);
    }
  };

  return (
    <div className="create-post-page">
      {/* 헤더 */}
      <div className="header">
        <button
          className="header-button"
          onClick={() => navigate("/community")}
        >
          X
        </button>
        <h2 className="header-title">글 작성</h2>
        <button className="header-button" onClick={createPost}>
          완료
        </button>
      </div>

      {/* 위치 선택 필드 */}
      <div className="location-select">
        <LocationSelectPost location={location} setLocation={setLocation} />
      </div>

      {/* 제목 입력 필드 */}
      <div className="title-input">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={handleTitleChange}
        />
        <p className="char-count">
          {title.length} / {TITLE_MAX_LENGTH} 글자
        </p>
      </div>

      {/* 내용 입력 필드 */}
      <div className="content-input">
        <textarea
          placeholder="현재 체감 날씨를 알려주세요! 커뮤니티에 적합하지 않은 글로 판단될 경우 삭제될 수 있습니다."
          value={content}
          onChange={handleContentChange}
        />
        <p className="char-count">
          {content.length} / {CONTENT_MAX_LENGTH} 글자
        </p>
      </div>

      {/* 팝업창 */}
      {showPopup && (
        <div className="popup">
          <p>{popupContent}</p>
          <button onClick={() => setShowPopup(false)}>확인</button>
        </div>
      )}
    </div>
  );
}

export default CreatePostPage;
