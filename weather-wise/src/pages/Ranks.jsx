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
import Modal from "../components/Modal"; // 모달 컴포넌트 불러오기
import { useNavigate } from "react-router-dom";
import "./Ranks.css";

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

  const fetchRankings = async (page) => {
    setLoading(true);
    try {
      const url = `/rankings`;
      const response = await AxiosInstance.get(url, {
        params: { page }, // 페이지 정보 전달
      });
      if (response.data.code === "success") {
        const { rankingList, hasNext } = response.data.result;
        setRankData(rankingList);
        setHasNext(hasNext); // 다음 페이지 여부 설정
        setHasPrev(page > 0); // 페이지가 0보다 크면 이전 페이지 존재
      } else {
        setError("데이터를 불러오는 데 실패했습니다.");
      }
    } catch (err) {
      setError("서버와의 통신에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setSearchResult(null); // 이전 결과 초기화

    if (!searchNickname.trim()) return;

    try {
      const url = `/ranking`; // 검색 API 호출
      const response = await AxiosInstance.get(url, {
        params: { nickname: searchNickname.trim() },
      });
      if (response.data.code === "success" && response.data.result) {
        setSearchResult(response.data.result);
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
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
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

      <div>
        <RankComment />
      </div>

      {/* RankList에 rankData와 page 전달 */}
      <RankList rankData={rankData} page={page} />

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

      {/* 검색 결과를 Rank 컴포넌트로 렌더링 */}
      {searchResult && (
        <div className="search-result">
          <Rank
            rank={searchResult.rank}
            nickname={searchResult.nickName}
            level={searchResult.level}
          />
        </div>
      )}

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
