import React, { useState, useEffect } from "react";
import UserPostItem from "../components/community/UserPostItem";
import Header from "../components/Header";
import Footer from "../components/Footer";
import left from "../assets/left.png";
import Button from "../components/Button";
import mainLogo from "../assets/mainLogo.png";
import Modal from "../components/Modal";
import "./MyPostPage.css";
// 시간 변환 유틸리티 함수 import
import { convertArrayToDate } from "../utils/timeUtils";
import AxiosInstance from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";

const MyPostPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const goToBack = () => {
    navigate("/myprofile"); // 원하는 페이지로 이동
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const url = `/boards/user`;
        const response = await AxiosInstance.get(url);

        // 게시글을 createdAt 필드 기준으로 최신순(내림차순) 정렬
        const sortedPosts = response.data.boards.sort((a, b) => {
          const dateA = Array.isArray(a.createdAt)
            ? convertArrayToDate(a.createdAt)
            : new Date(a.createdAt);
          const dateB = Array.isArray(b.createdAt)
            ? convertArrayToDate(b.createdAt)
            : new Date(b.createdAt);
          return dateB - dateA; // 내림차순 정렬
        });

        setPosts(sortedPosts); // 정렬된 게시글을 상태에 저장
      } catch (error) {
        console.error("게시글을 불러오는 중 오류 발생:", error);
      }
    };
    fetchUserPosts();
  }, []);

  return (
    <div className="my-post-page">
      <Header 
          leftChild={
            <Button
              text={<img src={left} alt="Back" />}
              type="icon"
              onClick={() => navigate("/myprofile")}
            />
          }
        onLeftClick={goToBack}
        title="내가 작성한 글" />
      <div className="post-list">
        {posts.map((post) => (
          <UserPostItem key={post.boardId} post={post} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default MyPostPage;
