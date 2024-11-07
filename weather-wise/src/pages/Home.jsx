import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import Weather from "../components/Weather";
import Summary from "../components/Summary";
import AxiosInstance from "../utils/AxiosInstance"; // AxiosInstance 가져오기
import Modal from "../components/Modal"; // Modal 컴포넌트 가져오기

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

  useEffect(() => {
    const checkSurveyStatus = async () => {
      try {
        const response = await AxiosInstance.get("/home");

        if (response.status === 200) {
          const { didSurvey } = response.data.result;

          if (!didSurvey) {
            setIsModalOpen(true); // 모달 열기
          }
        } else {
          console.error("데이터 가져오기 실패:", response.statusText);
        }
      } catch (error) {
        console.error("API 호출 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSurveyStatus();
  }, []);

  const handleSurveyStart = () => {
    setIsModalOpen(false); // 모달 닫기
    navigate("/survey"); // /survey로 이동
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <Header
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

      <Weather />
      <Summary />
      <Footer />

      {/* Modal 컴포넌트 추가 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleSurveyStart} // 확인 버튼 클릭 시 handleSurveyStart 호출
        message="설문조사를 시작할게요!"
      />
    </div>
  );
};

export default Home;
