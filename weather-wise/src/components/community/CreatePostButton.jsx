import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePostIcon from '../../assets/CreatePost.png'; // 아이콘 이미지 경로
import './CreatePostButton.css';

function CreatePostButton({ onClick }) {
  const navigate = useNavigate();

  return (
    <img 
      src={CreatePostIcon} 
      alt="Create Post" 
      className="create-post-button" 
      onClick={onClick}// 글 작성 페이지로 이동
    />
  );
}

export default CreatePostButton;