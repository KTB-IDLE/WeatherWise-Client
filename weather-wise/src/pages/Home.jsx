import React from "react";
import Header from "../components/Header";
import Button from "../components/Button"; // Button 컴포넌트를 불러옴
import Footer from "../components/Footer";
import left from "../assets/left.png";
import mainLogo from "../assets/mainLogo.png";
import info from "../assets/info.png";
import Weather from "../components/Weather";
import Summary from "../components/Summary";

const Home = () => {
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
              onClick={() => console.log("Notification button clicked")}
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
