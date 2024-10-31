import React from "react";
import Header from "../components/Header";
import Button from "../components/Button"; // Button 컴포넌트를 불러옴
import Footer from "../components/Footer";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import LoginForm from "../components/LoginForm"; // 로그인 폼을 불러옴

const Login = () => {
  const API_BASE_URL_FOR_OAUTH = import.meta.env.VITE_API_BASE_URL_FOR_OAUTH;
  const API_BASE_URL = import.meta.env.VITE_API_BASE;
  console.log("API_BASE_URL_FOR_OAUTH:", API_BASE_URL_FOR_OAUTH);
  console.log("API_BASE_URL:", API_BASE_URL);
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

      <h1> Weather Wise </h1>

      <LoginForm />
    </div>
  );
};

export default Login;
