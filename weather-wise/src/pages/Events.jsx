import React, { useState, useEffect } from "react";
import "./Events.css";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Coupon from "../components/Coupon";
import Modal from "../components/Modal"; // Modal 컴포넌트 추가
import mainLogo from "../assets/mainLogo.png";
import AxiosInstance from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom"; // useNavigate 가져오기
import left from "../assets/left.png";

const Events = () => {
  const [coupons, setCoupons] = useState([]); // 쿠폰 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [modalOpen, setModalOpen] = useState(false); // 모달 상태
  const [modalMessage, setModalMessage] = useState(""); // 모달에 표시할 메시지
  const goToBack = () => {
    navigate("/myprofile"); // 원하는 페이지로 이동
  };

  const navigate = useNavigate(); // navigate 선언
  // API 호출
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await AxiosInstance.get("/coupons");
        setCoupons(response.data); // API로부터 받은 쿠폰 데이터를 상태에 저장
      } catch (error) {
        console.error("쿠폰 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchCoupons();
  }, []);

  // 쿠폰 발급 버튼 클릭 핸들러
  const handleCouponClaim = async (couponId, couponName) => {
    try {
      const response = await AxiosInstance.post(`/coupons/${couponId}`);
      if (response.status === 200) {
        setModalMessage(`${couponName} 쿠폰 발급 성공!`);
        setModalOpen(true); // 모달 열기
      }
    } catch (error) {
      // 서버에서 반환된 에러 메시지 추출
      const errorMessage =
        error.response?.data?.error?.message ||
        "쿠폰 발급 중 알 수 없는 오류 발생.";
      console.error("쿠폰 발급 중 오류 발생:", errorMessage);

      // 추출한 에러 메시지를 모달에 표시
      setModalMessage(`쿠폰 발급 실패: ${errorMessage}`);
      setModalOpen(true); // 모달 열기
    }
  };

  // 로딩 중 상태 처리
  if (loading) {
    return <div className="loading-text">쿠폰 데이터를 불러오는 중...</div>;
  }

  return (
    <div>
      <Header
        leftChild={
                <Button
                  text={<img src={left} alt="Back" />}
                  type="icon"
                  onClick={() => navigate("/myprofile")}
                />
              }
        onLeftClick={goToBack}
        title={<img src={mainLogo} alt="mainLogo" />}
      />
      <div className="events-container">
        {/* 동적으로 Coupon 컴포넌트를 렌더링 */}
        {coupons.map((coupon, index) => (
          <Coupon
            key={index}
            headerClass="offline-header"
            headerText="선착순 쿠폰"
            id={coupon.id}
            name={coupon.name}
            condition={coupon.condition}
            quantity={`남은 수량: ${coupon.quantity}장`}
            buttons={[
              {
                className: "offline-button",
                text: "쿠폰 받기 ↓",
                onClick: () => handleCouponClaim(coupon.id, coupon.name),
              },
            ]}
          />
        ))}
      </div>

      {/* Modal 컴포넌트 */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMessage}
      />

      <Footer />
    </div>
  );
};

export default Events;
