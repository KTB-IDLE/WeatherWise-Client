import home from "../assets/home.png";
import community from "../assets/community.png";
import challenge from "../assets/challenge.png";
import rank from "../assets/rank.png";
import "../components/Footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <button className="footer-icon">
        <img src={home} alt="home" />
      </button>
      <button className="footer-icon">
        <img src={challenge} alt="challenge" />
      </button>
      <button className="footer-icon">
        <img src={community} alt="community" />
      </button>
      <button className="footer-icon">
        <img src={rank} alt="rank" />
      </button>
    </footer>
  );
};

export default Footer;
