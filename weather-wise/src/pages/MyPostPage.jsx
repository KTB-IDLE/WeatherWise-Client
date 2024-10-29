import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserPostItem from '../components/community/UserPostItem';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './MyPostPage.css';
// 시간 변환 유틸리티 함수 import
import { convertArrayToDate } from '../utils/timeUtils';

const MyPostPage = () => {
    const userId = 1;

    const [posts, setPosts] = useState([]);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const accessToken = import.meta.env.VITE_API_ACCESS_TOKEN;

    useEffect(() => {
        const fetchUserPosts = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/boards/user/${userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            });

            // 게시글을 createdAt 필드 기준으로 최신순(내림차순) 정렬
            const sortedPosts = response.data.boards.sort((a, b) => {
            const dateA = Array.isArray(a.createdAt) ? convertArrayToDate(a.createdAt) : new Date(a.createdAt);
            const dateB = Array.isArray(b.createdAt) ? convertArrayToDate(b.createdAt) : new Date(b.createdAt);
            return dateB - dateA; // 내림차순 정렬
          });
  
            setPosts(sortedPosts); // 정렬된 게시글을 상태에 저장

            setPosts(sortedPosts);
        } catch (error) {
            console.error('게시글을 불러오는 중 오류 발생:', error);
        }
        };
        fetchUserPosts();
    }, [userId]);

    return (
        <div className="my-post-page">
        <Header title="내가 작성한 글" />
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
