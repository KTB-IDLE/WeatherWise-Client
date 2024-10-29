import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import Question from "../components/Question";
import SurveyConfirmButton from "../components/SurveyConfirmButton";
import sun from "../assets/sun-survey.png";
import cold from "../assets/cold-survey.png";
import sweating from "../assets/sweating-survey.png";

const Survey = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // JoinForm에서 전달된 회원가입 정보 받기
  const { email, password, nickname } = state || {}; // 이메일, 비밀번호, 닉네임 받기

  const [surveyAnswers, setSurveyAnswers] = useState({
    sunAnswer: null,
    coldAnswer: null,
    sweatingAnswer: null,
  });

  // 설문조사 응답 저장 함수 (boolean 값으로 저장)
  const handleSurveyAnswer = (question, answer) => {
    setSurveyAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: answer === "yes" ? true : false, // "yes"는 true, "no"는 false로 변환
    }));
  };

  // 설문조사 완료 후, 모든 데이터를 서버로 전송하는 함수
  const handleSubmitSurvey = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/users/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serialId: email,
            password,
            nickname,
            survey: surveyAnswers, // 설문조사 결과 (boolean)
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        navigate("/login");
      } else {
        alert("회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

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
      />

      <Question
        imageSrc={sun}
        questionText="더위를 잘 타는 편이신가요?"
        onYes={() => handleSurveyAnswer("sunAnswer", "yes")}
        onNo={() => handleSurveyAnswer("sunAnswer", "no")}
      />

      <Question
        imageSrc={cold}
        questionText="추위를 잘 타는 편이신가요?"
        onYes={() => handleSurveyAnswer("coldAnswer", "yes")}
        onNo={() => handleSurveyAnswer("coldAnswer", "no")}
      />

      <Question
        imageSrc={sweating}
        questionText="땀이 잘 나는 편이신가요?"
        onYes={() => handleSurveyAnswer("sweatingAnswer", "yes")}
        onNo={() => handleSurveyAnswer("sweatingAnswer", "no")}
      />

      <SurveyConfirmButton text={"확인"} onClick={handleSubmitSurvey} />
    </div>
  );
};

export default Survey;
