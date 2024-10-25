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
import Survey from "./pages/Survey";

function App() {
  // 쿠키에서 AccessToken 값을 가져오는 함수
  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    const foundCookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return foundCookie ? foundCookie.split("=")[1] : null;
  };

  // PrivateRoute: AccessToken이 있는 경우만 접근 가능
  const PrivateRoute = ({ children }) => {
    const accessToken = getCookie("accessToken");
    return accessToken ? children : <Navigate to="/login" />;
  };

  // PublicRoute: AccessToken이 없는 경우에만 접근 가능
  const PublicRoute = ({ children }) => {
    const accessToken = getCookie("accessToken");
    return accessToken ? <Navigate to="/" /> : children;
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
        path="/survey"
        element={
          <PublicRoute>
            <Survey />
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
        path="/fail"
        element={
          <PrivateRoute>
            <MissionFail />
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
