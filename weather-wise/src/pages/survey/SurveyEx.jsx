import React, { useState } from "react";
import "./SurveyEx.css"; // 스타일을 위한 CSS
import AxiosInstance from "../../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";

const SurveyEx = () => {
  // 질문과 보기들을 객체 형태로 정의
  const questions = [
    {
      questionText: "선호하는 날씨 상태를 선택해주세요.",
      options: [
        "맑고 화창한 날이 좋다.",
        "흐리거나 서늘한 날씨가 좋다.",
        "비나 눈이 오는 날씨를 좋아한다.",
        "건조한 날씨가 편하다.",
        "습도가 높아도 상관없다.",
      ],
    },
    {
      questionText:
        "날씨에 따른 옷차림에서 가장 중요하게 생각하는 점은 무엇인가요?",
      options: [
        "보온성이 중요하다.",
        "모자, 장갑, 목도리 등이 불편하다.",
        "날씨 변화에 대비해 레이어드가 가능해야 한다.",
        "편한 옷을 선호하며 겹쳐 입는 것을 싫어한다.",
        "별다른 기준이 없다.",
      ],
    },
    {
      questionText: "더운 날씨에 땀을 많이 흘리는 편인가요?",
      options: [
        "땀을 많이 흘립니다.",
        "보통입니다.",
        "땀이 잘 나는 체질이 아닙니다.",
      ],
    },
    {
      questionText: "강수나 적설 시 활동에 제한이 있나요?",
      options: [
        "비가 오는건 상관없으나 눈이 오면 불편합니다.",
        "눈이 오는건 상관없으나 비가 오면 불편합니다.",
        "야외활동이 잦아 눈/비 모두 민감합니다.",
        "주로 실내 활동을 하며 크게 상관이 없다.",
        "딱히 상관없습니다.",
      ],
    },
    {
      questionText: "추위에 민감한 편인가요?",
      options: ["추위를 잘 타는 편입니다.", "추운 날씨를 선호합니다."],
    },
    {
      questionText: "더위를 많이 타는 편인가요?",
      options: ["더위를 잘 타는 편입니다.", "따뜻한 날씨를 선호합니다."],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(
    new Array(questions.length).fill(null)
  );
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const navigate = useNavigate();

  const handleSelect = (optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitSurvey();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitSurvey = async () => {
    const url = "/survey"; // 요청을 보낼 엔드포인트
    setLoading(true);

    try {
      // AxiosInstance를 사용해 PATCH 요청
      const response = await AxiosInstance.patch(url, { answers });

      if (response.status === 200) {
        navigate("/"); // 루트 경로로 리다이렉트
      } else {
        throw new Error("서버 응답 오류");
      }
    } catch (error) {
      console.error("설문 제출 중 오류 발생:", error);
      alert("설문 제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  };

  const selectedOption = answers[currentQuestion];

  return (
    <div className="container">
      <h1 className="question">{questions[currentQuestion].questionText}</h1>
      <div className="options">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              selectedOption === index ? "selected" : ""
            }`}
            onClick={() => handleSelect(index)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="navigation">
        <button onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
          이전
        </button>
        <button onClick={handleNextQuestion} disabled={loading}>
          {loading
            ? "로딩 중..." // 로딩 중일 때 버튼 텍스트
            : currentQuestion === questions.length - 1
            ? "완료"
            : "다음"}
        </button>
      </div>
    </div>
  );
};

export default SurveyEx;
