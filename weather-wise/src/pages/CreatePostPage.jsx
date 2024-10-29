import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocationSelectPost from '../components/community/LocationSelectPost'; // 위치 선택 컴포넌트
import './CreatePostPage.css';

function CreatePostPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState({ name: '', latitude: null, longitude: null });
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const accessToken = import.meta.env.VITE_API_ACCESS_TOKEN;

  const createPost = async () => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/boards`,
        {
          userId: 1,
          title,
          content,
          locationRequest: {
            locationName: location.name,
            latitude: location.latitude,
            longitude: location.longitude,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log('글 작성 성공:', response.data);
      navigate('/community');
    } catch (error) {
      console.error('글 작성 오류:', error);
    }
  };

  return (
    <div className="create-post-page">
      {/* 헤더 */}
      <div className="header">
        <button className="header-button" onClick={() => navigate('/community')}>
          X
        </button>
        <h2 className="header-title">글 작성</h2>
        <button className="header-button" onClick={createPost}>
          완료
        </button>
      </div>

      {/* 위치 선택 필드가 맨 위로 */}
      <div className="location-select">
        <LocationSelectPost location={location} setLocation={setLocation} />
      </div>

      {/* 제목 입력 필드 */}
      <div className="title-input">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 내용 입력 필드 */}
      <div className="content-input">
        <textarea
          placeholder="현재 체감 날씨를 알려주세요! 커뮤니티에 적합하지 않은 글로 판단될 경우 삭제될 수 있습니다."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </div>
  );
}

export default CreatePostPage;
