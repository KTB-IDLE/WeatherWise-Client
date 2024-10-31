import React from "react";
import "./MissionImage.css";

const MissionImage = ({
  completed,
  storeFileName,
  setImageFile,
  selectedImage,
  setSelectedImage,
  resetImage,
}) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setImageFile(file);

      // 같은 파일을 다시 선택해도 반응하도록 input을 초기화합니다.
      e.target.value = null;
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
