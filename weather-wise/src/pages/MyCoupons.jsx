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

  // API 요청
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await AxiosInstance.get("/user-coupons");
        setCoupons(response.data); // API 데이터 저장
      } catch (error) {
        console.error("쿠폰 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchCoupons();
  }, []);

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
        {coupons.map((coupon, index) => (
          <MyCoupon
            key={index}
            headerClass="offline-header"
            name={coupon.name}
            disCountValue={coupon.disCountValue}
            expirationDate={coupon.expirationDate}
            used={coupon.used}
            onClick={() => {
              alert(`${coupon.name} 쿠폰을 사용했습니다.`);
            }}
          />
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default MyCoupons;
