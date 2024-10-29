import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../utils/AxiosInstance';
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

  // 투표 수 가져오기
  const fetchVotes = async () => {
    try {
      const urlUpvote = `/boards/${post.boardId}/upvoteCount`;
      const urlDownvote = `/boards/${post.boardId}/downvoteCount`;
      const urlUserVote = `/boards/${post.boardId}/user`;
      
      const upvoteResponse = await AxiosInstance.get(urlUpvote);
      const downvoteResponse = await AxiosInstance.get(urlDownvote);
      const userVoteResponse = await AxiosInstance.get(urlUserVote);

      setUpvotes(upvoteResponse.data);
      setDownvotes(downvoteResponse.data);

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
      const url = `/boards/${post.boardId}/vote`;
      let newVote = 'UPVOTE';  // // 기본 voteType을 'UPVOTE'로 설정

      // 이미 'UPVOTE' 상태일 때는 투표 취소 -> userVote를 null로
      if (userVote === 'UPVOTE') {
        newVote = null;
      }

      // 투표 요청 보내기
      await AxiosInstance.post(url, null, {
        params: {
          voteType: newVote || 'UPVOTE' // 투표 취소 시에도 기본값으로 'UPVOTE' 전송
        }
      });

      fetchVotes(); // 투표 수를 다시 불러와 업데이트 및 상태 변경
      setUserVote(newVote);  // 투표 취소 시 userVote를 null로 설정
    } catch (error) {
      console.error('투표 오류:', error);
    }
  };

  // Downvote 처리
  const handleDownvote = async () => {
    try {
      const url = `/boards/${post.boardId}/vote`;
      let newVote = 'DOWNVOTE';  // downvote 요청 전송

      // 이미 'DOWNVOTE' 상태일 때는 투표 취소 -> userVote를 null로
      if (userVote === 'DOWNVOTE') {
        newVote = null;
      }

      // 투표 요청 보내기
      await AxiosInstance.post(url, null, {
        params: {
          voteType: newVote || 'DOWNVOTE' // 투표 취소 시에도 기본값으로 'UPVOTE' 전송
        }
      });

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
