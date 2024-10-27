import React from "react";
import Rank from "./Rank";
import "./RankList.css"; // 스타일을 위한 CSS 파일

const RankList = ({ rankData }) => {
  return (
    <div className="rank-list">
      {rankData.map((rankItem, index) => (
        <Rank
          key={index}
          rank={index + 1} // 순위를 1부터 시작하도록 설정
          nickname={rankItem.nickName}
          level={rankItem.level}
        />
      ))}
    </div>
  );
};

export default RankList;
