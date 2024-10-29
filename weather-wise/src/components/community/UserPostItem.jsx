import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPostItem.css';
import upVoteActiveIcon from '../../assets/upVote_active.png';
import upVoteNotActiveIcon from '../../assets/upVote_notActive.png';
import downVoteActiveIcon from '../../assets/downVote_active.png';
import downVoteNotActiveIcon from '../../assets/downVote_notActive.png';
import deleteIcon from '../../assets/postdelete.png';
import { convertArrayToDate, formatTime } from '../../utils/timeUtils';

const UserPostItem = ({ post }) => {
    const userId = 1; // 실제 사용자 ID 사용

    const [upvotes, setUpvotes] = useState(0);
    const [downvotes, setDownvotes] = useState(0);
    const [userVote, setUserVote] = useState(null);
    const [showPopup, setShowPopup] = useState(false); // 팝업 상태
    const [popupContent, setPopupContent] = useState(''); // 팝업 내용

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const accessToken = import.meta.env.VITE_API_ACCESS_TOKEN;

    const fetchVotes = async () => {
        try {
        const upvoteResponse = await axios.get(`${apiBaseUrl}/api/boards/${post.boardId}/upvoteCount`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const downvoteResponse = await axios.get(`${apiBaseUrl}/api/boards/${post.boardId}/downvoteCount`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        setUpvotes(upvoteResponse.data);
        setDownvotes(downvoteResponse.data);

        
        const userVoteResponse = await axios.get(`${apiBaseUrl}/api/boards/${post.boardId}/vote/${userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        setUserVote(userVoteResponse.data.voteType);
        } catch (error) {
        console.error('투표 수를 가져오는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        fetchVotes();
    }, [post.boardId]);

    const handleUpvote = async () => {
        let newVote = 'UPVOTE';
        if (userVote === 'UPVOTE') newVote = null;

        try {
        await axios.post(
            `${apiBaseUrl}/api/boards/${post.boardId}/vote`,
            null,
            {
            params: { userId: 1, voteType: newVote || 'UPVOTE' },
            headers: { Authorization: `Bearer ${accessToken}` },
            }
        );
        fetchVotes();
        setUserVote(newVote);
        } catch (error) {
        console.error('투표 오류:', error);
        }
    };

    const handleDownvote = async () => {
        let newVote = 'DOWNVOTE';
        if (userVote === 'DOWNVOTE') newVote = null;

        try {
        await axios.post(
            `${apiBaseUrl}/api/boards/${post.boardId}/vote`,
            null,
            {
            params: { userId: 1, voteType: newVote || 'DOWNVOTE' },
            headers: { Authorization: `Bearer ${accessToken}` },
            }
        );
        fetchVotes();
        setUserVote(newVote);
        } catch (error) {
        console.error('투표 오류:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${apiBaseUrl}/api/boards/${post.boardId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            });
            window.location.reload(); // 삭제 후 페이지 새로고침
        } catch (error) {
            console.error('게시글 삭제 중 오류 발생:', error);
        }
    };

    const createdAtDate = convertArrayToDate(post.createdAt);
    const formattedTime = createdAtDate ? formatTime(createdAtDate) : '날짜 없음';

  return (
    <div className="user-post-item">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      
      <div className="location-time-vote">
        <div className="location-time">
          <span className="location">{post.locationName}</span>
          <span className="separator"> · </span>
          <span className="time">{formattedTime}</span>
        </div>
        <div className="vote-buttons">
          <button
            className={`vote-button upvote ${userVote === 'UPVOTE' ? 'active' : ''}`}
            onClick={handleUpvote}
          >
            <img src={userVote === 'UPVOTE' ? upVoteActiveIcon : upVoteNotActiveIcon} alt="Upvote" />
            <span className="vote-count">{upvotes}</span>
          </button>
          <button
            className={`vote-button downvote ${userVote === 'DOWNVOTE' ? 'active' : ''}`}
            onClick={handleDownvote}
          >
            <img src={userVote === 'DOWNVOTE' ? downVoteActiveIcon : downVoteNotActiveIcon} alt="Downvote" />
            <span className="vote-count">{downvotes}</span>
          </button>
        </div>
      </div>

      <img src={deleteIcon} alt="Delete" className="delete-icon" onClick={() => { setShowPopup(true); setPopupContent('정말 삭제하시겠습니까?'); }} />

      {/* 팝업 */}
      {showPopup && (
        <div className="popup">
          <p>{popupContent}</p>
          <div className="popup-buttons">
            <button onClick={() => { handleDelete(); setShowPopup(false); }}>확인</button>
            <button onClick={() => setShowPopup(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPostItem;
