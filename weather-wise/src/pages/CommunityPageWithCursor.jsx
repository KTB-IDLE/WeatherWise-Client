import React, { useState, useEffect, useRef, useContext } from "react";
import AxiosInstance from "../utils/AxiosInstance";
import PostItem from "../components/community/PostItem";
import Button from "../components/Button";
import LocationSelect from "../components/community/LocationSelect";
import CreatePostButton from "../components/community/CreatePostButton";
import Header from "../components/Header";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import "./CommunityPage.css";
import { getCachedPost, setCachedPost } from "../utils/localStorageUtils"; // 캐싱 유틸리티
import { PostContext } from "../contexts/PostContext"; // PostContext import


// 소수점 5자리까지 반올림하는 함수
const roundToFiveDecimals = (num) => {
  return parseFloat(num.toFixed(4));
};

function CommunityPageWithCursor() {
  const { posts, setAllPosts, addPost } = useContext(PostContext); // Context 사용
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const [cursor, setCursor] = useState(null); // 커서 관리
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부 확인

  const observer = useRef(); // Intersection Observer를 위한 ref
  const navigate = useNavigate();
  const locationState = useLocation().state;

  // 게시글 가져오기 함수
  const fetchPosts = async (cursorParam) => {
    if (!location) {
      console.error("위치 정보가 없습니다. 게시글을 가져올 수 없습니다.");
      return;
    }
    const latitude = roundToFiveDecimals(location.latitude);
    const longitude = roundToFiveDecimals(location.longitude);

    const key = `POST_${latitude}_${longitude}`; // 로컬 스토리지 키 생성

    // if (!cursorParam) {
    //   // 첫 요청 시 캐싱된 데이터 확인
    //   const cachedPosts = getCachedPost(key);
    //   if (cachedPosts) {
    //     console.log("캐싱된 게시글 데이터 사용:", cachedPosts);
    //     setAllPosts(cachedPosts.posts); // 캐싱된 게시글 설정
    //     setCursor(cachedPosts.nextCursor); // 다음 커서 설정
    //     setHasMore(cachedPosts.hasMore); // 추가 데이터 여부 설정
    //     setLoading(false);
    //     return;
    //   }
    // }

    setLoading(true);
    setError(null);

    try {
      const url = `/boards/radius`;
      const response = await AxiosInstance.get(url, {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          cursor: cursorParam, // 커서로 createdAt 전달
        },
      });

      console.log("API 응답 데이터:", response.data); // 디버깅 로그

      const newPosts = response.data.boards;

      if (!cursorParam) {
        // 첫 페이지 데이터를 캐싱
        setCachedPost(key, {
          posts: newPosts,
          nextCursor: response.data.nextCursor,
          hasMore: response.data.hasMore,
        });
        setAllPosts(newPosts);
      } else {
        const updatedPosts = [...posts, ...newPosts];
        setAllPosts(updatedPosts);

          // 기존 캐싱 데이터 불러오기
        const cachedPosts = getCachedPost(key);
        if (cachedPosts) {
          // 새로운 게시글을 캐시에 추가
          setCachedPost(key, {
            posts: [...cachedPosts.posts, ...newPosts],
            nextCursor: response.data.nextCursor,
            hasMore: response.data.hasMore,
          });
        } else {
          // 캐시가 없으면 새로 설정
          setCachedPost(key, {
            posts: newPosts,
            nextCursor: response.data.nextCursor,
            hasMore: response.data.hasMore,
          });
        }
      }

      setCursor(response.data.nextCursor); // 다음 커서 설정
      setHasMore(response.data.hasMore); // 추가 데이터 여부 설정
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
      // 페이지에 들어갈 때 스크롤을 최상단으로 이동
    window.scrollTo(0, 0);   
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
    console.log("위치가 변경되었습니다:", location); // 디버깅 로그
    setAllPosts([]); // 게시글 초기화
    setCursor(null); // 커서 초기화
    setHasMore(true); // 추가 데이터 가능 상태로 설정
    if (location) {
      fetchPosts(null); // 첫 요청: 커서 없이 요청
    }
  }, [location]);

  // 새로운 게시글이 생성되었을 때 게시글 목록에 추가
  useEffect(() => {
    if (locationState?.newPost) {
      // 새 게시글이 생성되었음을 감지
      fetchPosts(null); // 게시글 재로드
    }
  }, [locationState]);

  return (
    <div className="community-page">
      {/* 헤더 */}
      <Header
        leftChild={<Button text={<img src={left} alt="Back" />} type="icon" />}
        title={<img src={mainLogo} alt="mainLogo" />}
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
          if (!post || !post.boardId) return null; // 게시글이 undefined이거나 boardId가 없는 경우 건너뜀
          const uniqueKey = `${post.boardId}-${index}`; // 고유 키 생성
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
      <CreatePostButton
        onClick={() => {
          navigate("/create-post");
        }}
      />

      {/* 하단바 */}
      <Footer />
    </div>
  );
}

export default CommunityPageWithCursor;
