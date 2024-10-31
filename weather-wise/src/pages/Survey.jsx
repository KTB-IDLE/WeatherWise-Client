import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import Question from "../components/Question";
import SurveyConfirmButton from "../components/SurveyConfirmButton";
import sun from "../assets/sun-survey.png";
import cold from "../assets/cold-survey.png";
import sweating from "../assets/sweating-survey.png";
import AxiosInstance from "../utils/AxiosInstance";

const Survey = () => {
  const navigate = useNavigate();

  const [surveyAnswers, setSurveyAnswers] = useState({
    sunAnswer: null,
    coldAnswer: null,
    sweatingAnswer: null,
  });

  const handleSurveyAnswer = (question, answer) => {
    setSurveyAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: answer === "yes",
    }));
  };

  const handleSubmitSurvey = async () => {
    try {
      const response = await AxiosInstance.patch("/survey", surveyAnswers);

      if (response.status === 200) {
        navigate("/"); // 200 응답을 받으면 루트 경로로 리디렉션
      } else {
        alert("설문조사 제출에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
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
        additionalClass="extra-margin-top" // 두 번째 Question에 추가 클래스 전달
      />
      <Question
        imageSrc={sweating}
        questionText="땀이 잘 나는 편이신가요?"
        onYes={() => handleSurveyAnswer("sweatingAnswer", "yes")}
        onNo={() => handleSurveyAnswer("sweatingAnswer", "no")}
        additionalClass="extra-margin-top" // 세 번째 Question에도 추가 클래스 전달
      />
      <SurveyConfirmButton text={"확인"} onClick={handleSubmitSurvey} />
    </div>
  );
};

export default Survey;
