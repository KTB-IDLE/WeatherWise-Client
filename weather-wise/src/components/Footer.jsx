import { Link } from 'react-router-dom';
import home from "../assets/home.png";
import community from "../assets/community.png";
import challenge from "../assets/challenge.png";
import rank from "../assets/rank.png";
import "../components/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <Link to="/">
      <button className="footer-icon">
        <img src={home} alt="home" />
      </button>
      </Link>
      <button className="footer-icon">
        <img src={challenge} alt="challenge" />
      </button>
      <Link to="/community">
      <button className="footer-icon">
        <img src={community} alt="community" />
      </button>
      </Link>
      <button className="footer-icon">
        <img src={rank} alt="rank" />
      </button>
    </footer>
  );
};

export default Footer;
