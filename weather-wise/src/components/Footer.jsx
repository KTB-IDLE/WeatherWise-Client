import { useNavigate } from "react-router-dom"; // useNavigate 훅을 임포트
import home from "../assets/home.png";
import community from "../assets/community.png";
import challenge from "../assets/challenge.png";
import rank from "../assets/rank.png";
import "../components/Footer.css";

const Footer = () => {
  const navigate = useNavigate(); // useNavigate를 사용하여 navigate 함수 얻기

  return (
    <footer className="footer">
      <button className="footer-icon" onClick={() => navigate("/")}>
        <img src={home} alt="home" />
      </button>
      <button className="footer-icon" onClick={() => navigate("/missions")}>
        <img src={challenge} alt="challenge" />
      </button>
      <button className="footer-icon" onClick={() => navigate("/community")}>
        <img src={community} alt="community" />
      </button>
      <button className="footer-icon" onClick={() => navigate("/rank")}>
        <img src={rank} alt="rank" />
      </button>
    </footer>
  );
};

export default Footer;
