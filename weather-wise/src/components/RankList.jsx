import React from "react";
import Rank from "./Rank";
import "./RankList.css";

const RankList = ({ rankData, page }) => {
  const itemsPerPage = 10; // 한 페이지당 항목 수

  return (
    <div className="rank-list">
      {rankData.map((rankItem, index) => (
        <Rank
          key={index}
          rank={page * itemsPerPage + index + 1} // 현재 페이지 기반 순위 계산
          nickname={rankItem.nickName}
          level={rankItem.level}
        />
      ))}
    </div>
  );
};

export default RankList;
