import React from "react";
import Header from "../components/Header";
import Button from "../components/Button"; // Button 컴포넌트를 불러옴
import Footer from "../components/Footer";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import LoginForm from "../components/LoginForm"; // 로그인 폼을 불러옴

const Login = () => {
  return (
    <div>
      <Header
        leftChild={<Button type="icon" />}
        title={<img src={mainLogo} alt="mainLogo" />}
      />

      <h1> Weather Wise </h1>

      <LoginForm />
    </div>
  );
};

export default Login;
