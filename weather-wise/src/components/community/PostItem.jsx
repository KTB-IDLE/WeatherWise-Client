import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PostItem.css';
import upVoteActiveIcon from '../../assets/upVote_active.png';
import upVoteNotActiveIcon from '../../assets/upVote_notActive.png';
import downVoteActiveIcon from '../../assets/downVote_active.png';
import downVoteNotActiveIcon from '../../assets/downVote_notActive.png';
import { convertArrayToDate, formatTime } from '../../utils/timeUtils';

function PostItem({ post }) {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [userVote, setUserVote] = useState(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const accessToken = import.meta.env.VITE_API_ACCESS_TOKEN;

  // 투표 수 가져오기
  const fetchVotes = async () => {
    try {
      const upvoteResponse = await axios.get(`${apiBaseUrl}/api/boards/${post.boardId}/upvoteCount`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const downvoteResponse = await axios.get(`${apiBaseUrl}/api/boards/${post.boardId}/downvoteCount`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUpvotes(upvoteResponse.data);
      setDownvotes(downvoteResponse.data);

      // 2. 사용자의 투표 상태 가져오기
      const userId = 1;
      const userVoteResponse = await axios.get(`${apiBaseUrl}/api/boards/${post.boardId}/vote/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // 서버에서 받아온 사용자의 투표 상태를 설정 (UPVOTE, DOWNVOTE, null)
      setUserVote(userVoteResponse.data.voteType);  // userVote는 'UPVOTE', 'DOWNVOTE', 또는 null
      
    } catch (error) {
      console.error('투표 수를 가져오는 중 오류 발생:', error);
    }
  };

  // 컴포넌트가 렌더링될 때 투표 수를 가져옵니다.
  useEffect(() => {
    fetchVotes();
  }, [post.boardId]);

  // Upvote 처리
  const handleUpvote = async () => {
    try {
      let newVote = 'UPVOTE';  // upvote 요청 전송

      // 이미 'UPVOTE' 상태일 때는 투표 취소 -> userVote를 null로
      if (userVote === 'UPVOTE') {
        newVote = null;
      }

      await axios.post(
        `${apiBaseUrl}/api/boards/${post.boardId}/vote`,
        null,
        {
          params: {
            userId: 1,
            voteType: newVote || 'UPVOTE',  // 투표 취소 시에도 'UPVOTE' 전송
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      fetchVotes();
      setUserVote(newVote);  // 투표 취소 시 userVote를 null로 설정
    } catch (error) {
      console.error('투표 오류:', error);
    }
  };

  // Downvote 처리
  const handleDownvote = async () => {
    try {
      let newVote = 'DOWNVOTE';  // downvote 요청 전송

      // 이미 'DOWNVOTE' 상태일 때는 투표 취소 -> userVote를 null로
      if (userVote === 'DOWNVOTE') {
        newVote = null;
      }

      await axios.post(
        `${apiBaseUrl}/api/boards/${post.boardId}/vote`,
        null,
        {
          params: {
            userId: 1,
            voteType: newVote || 'DOWNVOTE',  // 투표 취소 시에도 'DOWNVOTE' 전송
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      fetchVotes();
      setUserVote(newVote);  // 투표 취소 시 userVote를 null로 설정
    } catch (error) {
      console.error('투표 오류:', error);
    }
  };

  // createdAt 값을 JavaScript Date 객체로 변환하고, 가독성 좋은 형식으로 변환
  const createdAtDate = convertArrayToDate(post.createdAt);
  const formattedTime = createdAtDate ? formatTime(createdAtDate) : '날짜 없음';

  return (
    <div className="post-item">
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
    </div>
  );
}

export default PostItem;
