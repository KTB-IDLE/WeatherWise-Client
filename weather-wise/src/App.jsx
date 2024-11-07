import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Missions from "./pages/Missions";
import Notfound from "./pages/Notfound";
import MissionDetails from "./pages/MissionDetails";
import CommunityPage from "./pages/CommunityPage";
import CreatePostPage from "./pages/CreatePostPage";
import MyProfilePage from "./pages/MyProfilePage";
import MyPostPage from "./pages/MyPostPage";
import MissionSuccess from "./pages/MissionSuccess";
import MissionFail from "./pages/MissionFail";
import Ranks from "./pages/Ranks";
import Join from "./pages/Join";
import Login from "./pages/Login";
import Survey from "./pages/Survey";

function App() {
  // 쿠키에서 AccessToken 값을 가져오는 함수
  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
    /* const cookies = document.cookie.split("; ");
    const foundCookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return foundCookie ? foundCookie.split("=")[1] : null; */
  };

    // AccessToken 상태를 useState로 관리
    const [accessToken, setAccessToken] = useState(getCookie("accessToken"));

    useEffect(() => {
      const checkAccessToken = () => {
        setAccessToken(getCookie("accessToken")); // accessToken을 주기적으로 업데이트
      };
  
      // 주기적으로 쿠키를 확인해 accessToken이 유효한지 검사 (Polling 방식)
      const interval = setInterval(checkAccessToken, 1000);
  
      return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 인터벌 정리
    }, []);

  // PrivateRoute: AccessToken이 있는 경우만 접근 가능
  const PrivateRoute = ({ children }) => {
    return accessToken ? children : <Navigate to="/login" replace />;
  };

  // PublicRoute: AccessToken이 없는 경우에만 접근 가능
  const PublicRoute = ({ children }) => {
    return accessToken ? <Navigate to="/" replace /> : children;
  };

  return (
    <Routes>
      {/* /로 접근할 때 AccessToken 유무에 따라 Home 또는 Login으로 리다이렉트 */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/join"
        element={
          <PublicRoute>
            <Join />
          </PublicRoute>
        }
      />

      {/* 아래는 PrivateRoute 적용하여 AccessToken 없을 시 로그인 페이지로 리다이렉트 */}
      <Route
        path="/missions"
        element={
          <PrivateRoute>
            <Missions />
          </PrivateRoute>
        }
      />
      <Route
        path="/missions/:id"
        element={
          <PrivateRoute>
            <MissionDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/success"
        element={
          <PrivateRoute>
            <MissionSuccess />
          </PrivateRoute>
        }
      />

      <Route
        path="/survey"
        element={
          <PrivateRoute>
            <Survey />
          </PrivateRoute>
        }
      />

      <Route
        path="/fail"
        element={
          <PrivateRoute>
            <MissionFail />
          </PrivateRoute>
        }
      />

      <Route
        path="/community"
        element={
          <PrivateRoute>
            <CommunityPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/create-post"
        element={
          <PrivateRoute>
            <CreatePostPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/myprofile"
        element={
          <PrivateRoute>
            <MyProfilePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/myposts"
        element={
          <PrivateRoute>
            <MyPostPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/rank"
        element={
          <PrivateRoute>
            <Ranks />
          </PrivateRoute>
        }
      />
      {/* Not found */}
      <Route path="*" element={<Notfound />} />
    </Routes>
  );
}

export default App;
