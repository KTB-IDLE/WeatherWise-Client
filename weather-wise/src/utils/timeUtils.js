// src/utils/timeUtils.js

  // createdAt을 Date 객체로 변환하는 함수
  export const convertArrayToDate = (dateInput) => {
    if (Array.isArray(dateInput) && dateInput.length >= 6) {
      // 배열 형식 [year, month, day, hour, minute, second]
      const [year, month, day, hour, minute, second] = dateInput;
      return new Date(year, month - 1, day, hour, minute, second);
    } else if (typeof dateInput === 'string') {
      // 문자열 형식 '2024-11-06 16:47:28.740585'
      return new Date(dateInput); // 문자열을 직접 Date 객체로 변환
    }
    return null; // 형식이 맞지 않으면 null 반환
  };
  
  // 시간을 가독성 좋게 변환하는 함수
  export const formatTime = (date) => {
    if (!date) return '날짜 없음';
    const now = new Date();
    const diff = (now - date) / 1000;

    if (diff < 60) {
      return `${Math.floor(diff)}초 전`;
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)}분 전`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)}시간 전`;
    } else if (diff < 604800) {
      const daysAgo = Math.floor(diff / 86400);
      return daysAgo === 7 ? '일주일 전' : `${daysAgo}일 전`;
    } else {
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      });
    }
  };
  