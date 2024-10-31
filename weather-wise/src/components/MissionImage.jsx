import React from "react";
import "./MissionImage.css"; // CSS 파일 임포트

const MissionImage = ({
  completed,
  storeFileName,
  setImageFile,
  selectedImage,
  setSelectedImage,
  resetImage,
}) => {
  console.log(storeFileName);
  // 이미지 파일이 변경될 때 실행되는 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // 이미지 URL 생성
      setSelectedImage(imageUrl); // 선택된 이미지 상태 업데이트
      setImageFile(file); // 상위 컴포넌트로 이미지 파일 전달
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
        {completed && storeFileName ? (
          <img
            src={storeFileName}
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
