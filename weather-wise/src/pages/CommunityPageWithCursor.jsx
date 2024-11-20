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

function CommunityPageWithCursor() {
  const [posts, setPosts] = useState([]); // 게시글 리스트
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const [cursor, setCursor] = useState(null); // 커서 관리
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부 확인

  const observer = useRef(); // Intersection Observer를 위한 ref
  const navigate = useNavigate();

  // 게시글 가져오기 함수
  const fetchPosts = async (cursor) => {
    if (!location) return;
    setLoading(true);
    setError(null);

    try {
      const url = `/boards/radius`;
      const response = await AxiosInstance.get(url, {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          cursor, // 커서로 createdAt 전달
        },
      });
      console.log("response = ", response);
      const newPosts = response.data.boards;

      setPosts((prevPosts) => [...prevPosts, ...newPosts]); // 이전 데이터에 추가
      setCursor(response.data.nextCursor); // 다음 커서 설정
      setHasMore(response.data.hasMore); // 다음 데이터 여부 설정
    } catch (error) {
      console.error("게시글을 불러오는 중 오류 발생:", error);
      setError("게시글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
    console.log("hasMore:", hasMore);
    console.log("nextCursor:", cursor);
  };

  // 무한스크롤을 감지하는 함수
  const lastPostElementRef = useRef();

  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts(cursor); // 다음 데이터 요청
        }
      },
      { threshold: 1.0 }
    );

    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }
  }, [loading, hasMore, cursor]);

  // 위치 변경 시 초기화 후 게시글 로드
  useEffect(() => {
    setPosts([]); // 게시글 초기화
    setCursor(null); // 커서 초기화
    setHasMore(true); // 추가 데이터 가능 상태로 설정
    if (location) {
      fetchPosts(null); // 첫 요청: 커서 없이 요청
    }
  }, [location]);

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
          const uniqueKey = `${post.createdAt}-${index}`; // 고유 키 생성
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostElementRef} key={uniqueKey}>
                <PostItem post={post} />
              </div>
            );
          } else {
            return <PostItem key={uniqueKey} post={post} />;
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

export default CommunityPageWithCursor;
