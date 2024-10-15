import "../components/RankComment.css";
const RankComment = () => {
  return (
    <>
      <h1>명예의 전당</h1>
      <div className="rank-table-header">
        <div className="rank-header-item">순위</div>
        <div className="rank-header-item">닉네임</div>
        <div className="rank-header-item">레벨</div>
      </div>
    </>
  );
};

export default RankComment;
