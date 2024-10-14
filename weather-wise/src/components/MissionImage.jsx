import React, { useState } from "react";
import "./MissionImage.css"; // CSS 파일 임포트

const MissionImage = ({ completed, uploadFileLink }) => {
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 상태 관리

  // 이미지 파일이 변경될 때 실행되는 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // 이미지 URL 생성
      setSelectedImage(imageUrl); // 선택된 이미지 상태 업데이트
    }
  };

  return (
    <div className="mission-image-container">
      <h2>미션을 수행한 사진을 아래에 첨부해주세요</h2>

      <div
        className="image-upload-box"
        onClick={() =>
          !completed && document.getElementById("imageInput").click()
        }
      >
        {/* 이미지를 보여줄 때 */}
        {completed && uploadFileLink ? (
          <img
            src={uploadFileLink}
            alt="Uploaded Mission"
            className="mission-image"
          />
        ) : selectedImage ? (
          <img
            src={selectedImage}
            alt="Selected Mission"
            className="mission-image"
          />
        ) : (
          <p>이미지를 첨부하려면 클릭하세요</p>
        )}
      </div>

      {/* completed가 false일 경우에만 파일 업로드 가능 */}
      {!completed && (
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      )}
    </div>
  );
};

export default MissionImage;
