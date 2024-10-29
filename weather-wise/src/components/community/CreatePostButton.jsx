import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePostIcon from '../../assets/CreatePost.png'; // 아이콘 이미지 경로
import './CreatePostButton.css';

function CreatePostButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate('/create-post')} className="create-post-button">
      <img src={CreatePostIcon} alt="Create Post" />
    </button>
  );
}

export default CreatePostButton;
