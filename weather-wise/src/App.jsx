import { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Missions from "./pages/Missions";
import Notfound from "./pages/Notfound";
import MissionDetails from "./pages/MissionDetails";
import MissionSuccess from "./pages/MissionSuccess";
import MissionFail from "./pages/MissionFail";
import Ranks from "./pages/Ranks";
import Join from "./pages/Join";
import Login from "./pages/Login";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/missions/:id" element={<MissionDetails />} />
        <Route path="/success" element={<MissionSuccess />} />
        <Route path="/fail" element={<MissionFail />} />
        <Route path="/rank" element={<Ranks />} />
        {/* 상세 페이지 경로 */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;
