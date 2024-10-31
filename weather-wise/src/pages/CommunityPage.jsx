import React, { useState, useEffect } from "react";
import AxiosInstance from "../utils/AxiosInstance";
import PostItem from "../components/community/PostItem";
import Button from "../components/Button";
import LocationSelect from "../components/community/LocationSelect";
import CreatePostButton from "../components/community/CreatePostButton";
import Header from "../components/Header";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import Footer from "../components/Footer";
import "./CommunityPage.css"; // CSS 파일 import

// 시간 변환 유틸리티 함수 import
import { convertArrayToDate } from "../utils/timeUtils";

function CommunityPage() {
  const [posts, setPosts] = useState([]); // 게시글 리스트
  const [location, setLocation] = useState({
    name: "서울특별시 강남구 대치동",
    latitude: 37.49992,
    longitude: 127.03784,
  });
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // 로딩 시작
      setError(null); // 에러 초기화

      try {
        const url = `/boards/radius`;
        const response = await AxiosInstance.get(url, {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        });
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
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchPosts(); // 게시글 가져오기 함수 호출
  }, [location]); // location의 좌표가 변경될 때마다 호출

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
      {loading && <p>게시글을 불러오는 중...</p>}

      {/* 에러 메시지 */}
      {error && <p>{error}</p>}

      {/* 게시글 목록 */}
      <div className="post-list">
        {!loading && !error && posts && posts.length > 0
          ? posts.map((post) => <PostItem key={post.boardId} post={post} />)
          : !loading && !error && <p>게시글이 없습니다.</p>}
      </div>

      {/* 글 작성 버튼 */}
      <CreatePostButton />

      {/* 하단바 */}
      <Footer />
    </div>
  );
}

export default CommunityPage;
