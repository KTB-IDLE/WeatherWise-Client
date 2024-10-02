import test from "../assets/test.jpeg";
import "../components/Weather.css";
const mainWeather = () => {
  return (
    <div
      className="weather-container"
      style={{ backgroundImage: `url(${test})` }}
    >
      <div className="weather-info">
        <h2 className="location">나의 위치</h2>
        <h3 className="city">성남시</h3>
        <h1 className="temperature">24°</h1>
        <h3 className="description">대체로 맑음</h3>
        <p className="high-low">최고: 26° 최저: 19°</p>
      </div>
    </div>
  );
};

export default mainWeather;
