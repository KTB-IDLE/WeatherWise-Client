import React, { useState, useEffect } from "react";
import AxiosInstance from "../../utils/AxiosInstance";
import "./PostItem.css";
import upVoteActiveIcon from "../../assets/upVote_active.png";
import upVoteNotActiveIcon from "../../assets/upVote_notActive.png";
import downVoteActiveIcon from "../../assets/downVote_active.png";
import downVoteNotActiveIcon from "../../assets/downVote_notActive.png";
import { formatTime } from "../../utils/timeUtils";

function PostItem({ post }) {
  console.log("createdAt 데이터:", post); // 데이터 형식을 확인하기 위해 로그 출력

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
      setUserVote(userVoteResponse.data.voteType);
    } catch (error) {
      console.error("투표 수를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, [post.boardId]);

  // Upvote 처리
  const handleUpvote = async () => {
    try {
      const url = `/boards/${post.boardId}/vote`;
      let newVote = "UPVOTE";

      if (userVote === "UPVOTE") {
        newVote = null;
      }

      await AxiosInstance.post(url, null, {
        params: {
          voteType: newVote || "UPVOTE",
        },
      });

      fetchVotes();
      setUserVote(newVote);
    } catch (error) {
      console.error("투표 오류:", error);
    }
  };

  // Downvote 처리
  const handleDownvote = async () => {
    try {
      const url = `/boards/${post.boardId}/vote`;
      let newVote = "DOWNVOTE";

      if (userVote === "DOWNVOTE") {
        newVote = null;
      }

      await AxiosInstance.post(url, null, {
        params: {
          voteType: newVote || "DOWNVOTE",
        },
      });

      fetchVotes();
      setUserVote(newVote);
    } catch (error) {
      console.error("투표 오류:", error);
    }
  };

  // createdAt 값을 JavaScript Date 객체로 변환하고, 가독성 좋은 형식으로 변환
  const createdAtDate = new Date(post.createdAt);
  const formattedTime =
    createdAtDate instanceof Date && !isNaN(createdAtDate)
      ? formatTime(createdAtDate)
      : "날짜 없음";

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
            className={`vote-button upvote ${
              userVote === "UPVOTE" ? "active" : ""
            }`}
            onClick={handleUpvote}
          >
            <img
              src={
                userVote === "UPVOTE" ? upVoteActiveIcon : upVoteNotActiveIcon
              }
              alt="Upvote"
            />
            <span className="vote-count">{upvotes}</span>
          </button>
          <button
            className={`vote-button downvote ${
              userVote === "DOWNVOTE" ? "active" : ""
            }`}
            onClick={handleDownvote}
          >
            <img
              src={
                userVote === "DOWNVOTE"
                  ? downVoteActiveIcon
                  : downVoteNotActiveIcon
              }
              alt="Downvote"
            />
            <span className="vote-count">{downvotes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostItem;
