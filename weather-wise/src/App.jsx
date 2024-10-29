import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Missions from "./pages/Missions";
import Notfound from "./pages/Notfound";
import MissionDetails from "./pages/MissionDetails";
import CommunityPage from './pages/CommunityPage';
import CreatePostPage from './pages/CreatePostPage';
import MyProfilePage from './pages/MyProfilePage';
import MyPostPage from './pages/MyPostPage';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/missions/:id" element={<MissionDetails />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/myprofile" element={<MyProfilePage />} />
        <Route path="/myposts" element={<MyPostPage />} />
        {/* 상세 페이지 경로 */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;
