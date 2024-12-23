// MyCoupons.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import MyCoupon from "../components/MyCoupon"; // MyCoupon 컴포넌트 추가
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import "./Events.css";
import AxiosInstance from "../utils/AxiosInstance"; // AxiosInstance 가져오기
import { useNavigate } from "react-router-dom"; // useNavigate 가져오기

const MyCoupons = () => {
  const navigate = useNavigate(); // navigate 함수 사용
  const [coupons, setCoupons] = useState([]); // 쿠폰 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  // API 요청: 쿠폰 데이터 가져오기
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await AxiosInstance.get("/user-coupons");
        setCoupons(response.data); // API 데이터 저장
        console.log("쿠폰 데이터:", response.data);
      } catch (error) {
        console.error("쿠폰 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchCoupons();
  }, []);

  // 쿠폰 사용 함수
  const handleUseCoupon = async (userCouponId) => {
    try {
      const response = await AxiosInstance.post(
        `/user-coupons/${userCouponId}`
      );

      if (response.status === 200) {
        // 성공 시, 해당 쿠폰을 used로 업데이트
        setCoupons((prevCoupons) =>
          prevCoupons.map((coupon) =>
            coupon.userCouponId === userCouponId
              ? { ...coupon, used: true, usedAt: new Date().toISOString() }
              : coupon
          )
        );
        alert("쿠폰이 성공적으로 사용되었습니다.");
      } else {
        alert("쿠폰 사용에 실패했습니다.");
      }
    } catch (error) {
      console.error("쿠폰 사용 중 오류 발생:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`쿠폰 사용 실패: ${error.response.data.message}`);
      } else {
        alert("쿠폰 사용 중 오류가 발생했습니다.");
      }
    }
  };

  // 로딩 중 상태 처리
  if (loading) {
    return <div className="loading-text">쿠폰 데이터를 불러오는 중...</div>;
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
              onClick={() => navigate("/myprofile")} // navigate 사용
            />
          </div>
        }
      />

      <div className="events-container">
        {/* MyCoupon 컴포넌트를 이용해 쿠폰 렌더링 */}
        {coupons.map((coupon) => (
          <MyCoupon
            key={coupon.userCouponId} // userCouponId를 key로 사용
            headerClass="offline-header"
            name={coupon.name}
            disCountValue={coupon.disCountValue}
            expirationDate={coupon.expirationDate}
            used={coupon.used}
            onClick={() => {
              if (!coupon.used) {
                handleUseCoupon(coupon.userCouponId); // userCouponId 사용
              }
            }}
          />
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default MyCoupons;
