import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Missions from "./pages/Missions";
import Notfound from "./pages/Notfound";
import MissionDetails from "./pages/MissionDetails";
import MissionSuccess from "./pages/MissionSuccess";
import MissionFail from "./pages/MissionFail";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/missions/:id" element={<MissionDetails />} />
        <Route path="/success" element={<MissionSuccess />} />
        <Route path="/fail" element={<MissionFail />} />
        {/* 상세 페이지 경로 */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;
