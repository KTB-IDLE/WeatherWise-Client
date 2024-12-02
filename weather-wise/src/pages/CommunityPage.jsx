import React, { useState, useEffect, useRef } from "react";
import AxiosInstance from "../utils/AxiosInstance";
import PostItem from "../components/community/PostItem";
import Button from "../components/Button";
import LocationSelect from "../components/community/LocationSelect";
import CreatePostButton from "../components/community/CreatePostButton";
import Header from "../components/Header";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "./CommunityPage.css";
import { convertArrayToDate } from "../utils/timeUtils";
import Loading from "./Loading";

import { getCachedPost, setCachedPost } from "../utils/localStorageUtils"; // 캐싱 유틸리티

function CommunityPage() {
  const [posts, setPosts] = useState([]); // 게시글 리스트
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const [page, setPage] = useState(0); // 페이지 상태 관리
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부 확인

  const observer = useRef(); // Intersection Observer를 위한 ref
  const navigate = useNavigate();

  console.log(latitude, longitude);

  const fetchPosts = async (page) => {
    if (!location) return;

    const key = `POST_${location.latitude}_${location.longitude}`; // 로컬 스토리지 키 생성

    console.log(key);

    if (page === 0) {
      // 첫 페이지일 때만 캐싱된 데이터 확인
      const cachedPosts = getCachedPost(key);
      if (cachedPosts) {
        console.log("캐싱된 게시글 데이터 사용:", cachedPosts);
        setPosts(cachedPosts);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const url = `/boards/radius`;
      const response = await AxiosInstance.get(url, {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          page, // 페이지 정보 전달
        },
      });

      const sortedPosts = response.data.boards.sort((a, b) => {
        const dateA = Array.isArray(a.createdAt)
          ? convertArrayToDate(a.createdAt)
          : new Date(a.createdAt);
        const dateB = Array.isArray(b.createdAt)
          ? convertArrayToDate(b.createdAt)
          : new Date(b.createdAt);
        return dateB - dateA; // 내림차순 정렬
      });

      if (page === 0) {
        // 첫 페이지 데이터는 캐싱
        setCachedPost(key, sortedPosts);
      }

      setPosts((prevPosts) => [...prevPosts, ...sortedPosts]); // 이전 데이터에 추가
      setHasMore(response.data.hasMore); // 다음 데이터 여부 설정
    } catch (error) {
      console.error("게시글을 불러오는 중 오류 발생:", error);
      setError("게시글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 무한스크롤을 감지하는 함수
  const lastPostElementRef = useRef();

  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1); // 페이지 증가
        }
      },
      { threshold: 1.0 }
    );

    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }
  }, [loading, hasMore]);

  // 위치 변경 시 초기화 후 게시글 로드
  useEffect(() => {
    setPage(0); // 페이지 초기화
    setPosts([]); // 게시글 초기화
    setHasMore(true); // 추가 데이터 가능 상태로 설정
    if (location) {
      fetchPosts(0); // 첫 페이지 로드
    }
  }, [location]);

  // 페이지 변경 시 데이터 추가 로드
  useEffect(() => {
    if (page > 0) {
      fetchPosts(page);
    }
  }, [page]);

  return (
    <div className="community-page">
      {/* 헤더 */}
      <Header
        leftChild={<Button text={<img src={left} alt="Back" />} type="icon" />}
        title={<img src={mainLogo} alt="mainLogo" />}
        rightChild={
          <div>
            <Button
              text={<img src={info} alt="info" />}
              type="icon"
              onClick={() => navigate("/myprofile")}
            />
          </div>
        }
      />

      {/* 위치 선택 */}
      <LocationSelect location={location} setLocation={setLocation} />

      {/* 로딩 중일 때 표시할 로딩 메시지 */}
      {loading && <p> 게시글을 불러오는 중...</p>}

      {/* 에러 메시지 */}
      {error && <p>{error}</p>}

      {/* 게시글 목록 */}
      <div className="post-list">
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostElementRef} key={post.boardId}>
                <PostItem post={post} />
              </div>
            );
          } else {
            return <PostItem key={post.boardId} post={post} />;
          }
        })}
      </div>

      {/* 글 작성 버튼 */}
      <CreatePostButton />

      {/* 하단바 */}
      <Footer />
    </div>
  );
}

export default CommunityPage;
