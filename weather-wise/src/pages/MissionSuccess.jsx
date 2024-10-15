const MissionSuccess = () => {
  const location = useLocation(); // 경로로 전달된 state 받기
  const { missionPoint, userLevel, userPoint } = location.state || {}; // state가 없을 경우 빈 객체 처리

  return (
    <div>
      <h1>인증 성공!</h1>
      <p>미션 포인트: {missionPoint}</p>
      <p>유저 레벨: {userLevel}</p>
      <p>유저 포인트: {userPoint}</p>
    </div>
  );
};

export default MissionSuccess;
