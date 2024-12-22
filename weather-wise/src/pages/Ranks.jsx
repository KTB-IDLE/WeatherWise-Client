import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import RankComment from "../components/RankComment";
import RankList from "../components/RankList";
import Rank from "../components/Rank"; // Rank 컴포넌트를 불러옴
import AxiosInstance from "../utils/AxiosInstance";
import Modal from "../components/Modal"; // Modal 컴포넌트 추가
import { useNavigate } from "react-router-dom";
import "./Ranks.css";
import "../components/Rank.css"; // Rank 스타일
import Loading from "./Loading";

const Ranks = () => {
  const navigate = useNavigate();
  const [rankData, setRankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // 페이지 상태 관리
  const [hasNext, setHasNext] = useState(false); // 다음 페이지 여부
  const [hasPrev, setHasPrev] = useState(false); // 이전 페이지 여부
  const [searchNickname, setSearchNickname] = useState(""); // 검색창 입력 상태
  const [searchResult, setSearchResult] = useState(null); // 검색 결과 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const [modalMessage, setModalMessage] = useState(""); // 모달 메시지 설정

  const [currentUserNickName, setCurrentUserNickName] = useState(""); // 모달 메시지 설정
  const [existUserInCurrentPage, setExistUserInCurrentPage] = useState(""); // 모달 메시지 설정
  const [currentUserRanking, setCurrentUserRanking] = useState(""); // 모달 메시지 설정
  const [currentUserLevel, setCurrentUserLevel] = useState(""); // 모달 메시지 설정

  // 순위 리스트 가져오기
  const fetchRankings = async (page) => {
    setLoading(true);
    setSearchResult(null); // 검색 상태 초기화
    setError(null); // 에러 초기화

    try {
      const url = `/rankings`;
      const response = await AxiosInstance.get(url, {
        params: { page }, // 페이지 정보 전달
      });
      console.log(response);
      if (response.data.code === "success") {
        const {
          rankingList,
          hasNext,
          currentUserNickName,
          existUserInCurrentPage,
          currentUserRanking,
          currentUserLevel,
        } = response.data.result;

        setRankData(rankingList);
        setHasNext(hasNext); // 다음 페이지 여부 설정
        setHasPrev(page > 0); // 페이지가 0보다 크면 이전 페이지 존재
        setCurrentUserNickName(currentUserNickName); // 현재 사용자 닉네임 저장
        setExistUserInCurrentPage(existUserInCurrentPage); // 현재 사용자 존재 여부 저장
        setCurrentUserRanking(currentUserRanking); // 현재 사용자 등수 저장
        setCurrentUserLevel(currentUserLevel); // 현재 사용자 레벨 저장
      } else {
        setError("데이터를 불러오는 데 실패했습니다.");
      }
    } catch (err) {
      setError("서버와의 통신에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 닉네임 검색
  const handleSearch = async () => {
    setSearchResult(null); // 이전 결과 초기화
    setError(null); // 에러 초기화

    if (!searchNickname.trim()) return;

    try {
      const url = `/ranking`; // 검색 API 호출
      const response = await AxiosInstance.get(url, {
        params: { nickname: searchNickname.trim() },
      });

      if (response.data.code === "success" && response.data.result) {
        setSearchResult(response.data.result); // 검색 결과 저장
      } else {
        setModalMessage("닉네임을 확인해주세요!"); // 모달 메시지 설정
        setIsModalOpen(true); // 모달 열기
      }
    } catch (err) {
      console.error("검색 실패:", err);
      setModalMessage("닉네임을 확인해주세요!"); // 모달 메시지 설정
      setIsModalOpen(true); // 모달 열기
    }
  };

  useEffect(() => {
    fetchRankings(page); // 페이지 변경 시 데이터 로드
  }, [page]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Header
        leftChild={<Button text={<img src={left} alt="Back" />} type="icon" />}
        title={<img src={mainLogo} alt="mainLogo" />}
      />

      <div>
        <RankComment />
      </div>

      {/* 검색 결과 */}
      {searchResult ? (
        <div className="search-result">
          <Rank
            rank={searchResult.rank}
            nickname={searchResult.nickName}
            level={searchResult.level}
          />
          <button
            className="clear-search"
            onClick={() => {
              setSearchResult(null); // 검색 결과 초기화
              setSearchNickname(""); // 검색창 초기화
            }}
          >
            전체 순위 보기
          </button>
        </div>
      ) : (
        <>
          {/* 기본 순위 리스트 */}
          <RankList
            rankData={rankData}
            page={page}
            currentUserNickName={currentUserNickName}
            existUserInCurrentPage={existUserInCurrentPage}
            currentUserLevel={currentUserLevel}
            currentUserRanking={currentUserRanking}
          />

          <div className="pagination-container">
            <button
              className="pagination-button"
              disabled={!hasPrev}
              onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
            >
              &lt;
            </button>
            <button
              className="pagination-button"
              disabled={!hasNext}
              onClick={() => setPage((prevPage) => prevPage + 1)}
            >
              &gt;
            </button>
          </div>
        </>
      )}

      {/* 검색창 */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="닉네임을 입력하세요"
          value={searchNickname}
          onChange={(e) => setSearchNickname(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          검색
        </button>
      </div>

      {/* 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // 모달 닫기
        message={modalMessage}
      />

      <Footer />
    </>
  );
};

export default Ranks;
