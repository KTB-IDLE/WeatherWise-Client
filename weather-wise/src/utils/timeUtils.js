// src/utils/timeUtils.js

// createdAt 배열을 JavaScript Date 객체로 변환하는 함수
export const convertArrayToDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 6) return null;
    const [year, month, day, hour, minute, second] = dateArray;
    return new Date(year, month - 1, day, hour, minute, second);
  };
  
  // 시간을 가독성 좋게 변환하는 함수
  export const formatTime = (date) => {
    const now = new Date();
    const diff = (now - date) / 1000; // 초 단위 차이 계산
  
    if (diff < 60) {
      return `${Math.floor(diff)}초 전`;
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)}분 전`; // 1시간 이내일 경우
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)}시간 전`; // 24시간 이내일 경우
    } else if (diff < 604800) { // 일주일 이내일 경우 (86400초 * 7일 = 604800초)
        const daysAgo = Math.floor(diff / 86400); // 일 단위 계산
        return daysAgo === 7 ? '일주일 전' : `${daysAgo}일 전`;
    } else {
      // 24시간 이후일 경우 'yyyy.mm.dd hh:mm' 형식으로 반환 (24시간 형식)
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23', // 24시간 형식 (00-23)
      });
    }
  };
  