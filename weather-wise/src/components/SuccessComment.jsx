import dollar from "../assets/dollar.png";
import "../components/SuccessComment.css";
const SuccessComent = () => {
  return (
    <div className="mission-success-container">
      <img src={dollar} alt="Congratulations" />
      <h1 className="mission-success-text">Congratulations!!</h1>
    </div>
  );
};

export default SuccessComent;
