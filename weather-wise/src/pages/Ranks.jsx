import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import RankComment from "../components/RankComment";
import RankList from "../components/RankList";
import React, { useState, useEffect } from "react"; // useState와 useEffect를 불러옴
import AxiosInstance from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";

const Ranks = () => {
  const navigate = useNavigate();
  const [rankData, setRankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const url = `/ranking`;
        const response = await AxiosInstance.get(url);
        if (response.data.code === "success") {
          setRankData(response.data.result.rankingList); // rankingList 설정
        } else {
          setError("데이터를 불러오는 데 실패했습니다.");
        }
      } catch (err) {
        setError("서버와의 통신에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);
  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <>
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

      <div>
        <RankComment />
      </div>

      {/* RankList에 데이터를 전달 */}
      <RankList rankData={rankData} />

      <Footer />
    </>
  );
};

export default Ranks;
