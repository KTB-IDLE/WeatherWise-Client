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

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSurveyStatus = async () => {
      try {
        const response = await AxiosInstance.get("/home");

        if (response.status === 200) {
          const { didSurvey } = response.data.result; // result에서 didSurvey 추출
          console.log("didSurvey 값:", didSurvey);

          if (!didSurvey) {
            navigate("/survey");
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
  }, [navigate]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <Header
        leftChild={
          <Button
            text={<img src={left} alt="Back" />}
            type="icon"
            onClick={() => console.log("Back button clicked")}
          />
        }
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
    </div>
  );
};

export default Home;
