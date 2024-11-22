import React from "react";
import "./Rank.css"; // Rank 스타일

const RankList = ({
  rankData,
  page,
  currentUserNickName,
  existUserInCurrentPage,
  currentUserLevel,
  currentUserRanking,
}) => {
  const itemsPerPage = 10; // 한 페이지당 항목 수
  const isUserInCurrentPage = rankData.some(
    (rankItem) => rankItem.nickName === currentUserNickName
  );

  console.log("currentUserLevel ", currentUserLevel);
  console.log("currentUserRanking ", currentUserRanking);

  return (
    <div className="rank-list">
      {/* 기본 랭킹 리스트 */}
      {rankData.map((rankItem, index) => {
        const isCurrentUser = rankItem.nickName === currentUserNickName;

        return (
          <div
            key={index}
            className={
              isCurrentUser ? "rank-container highlight" : "rank-container"
            }
          >
            <div className="rank-item">{page * itemsPerPage + index + 1}위</div>
            <div className="rank-item">{rankItem.nickName}</div>
            <div className="rank-item">{rankItem.level}Lv</div>
          </div>
        );
      })}

      {/* 본인 랭킹이 현재 페이지에 없으면 추가로 렌더링 */}
      {!isUserInCurrentPage && currentUserRanking && (
        <div className="rank-container highlight">
          <div className="rank-item-margin">{currentUserRanking}위</div>
          <div className="rank-item-margin">{currentUserNickName}</div>
          <div className="rank-item-margin">{currentUserLevel}Lv</div>
        </div>
      )}
    </div>
  );
};

export default RankList;
