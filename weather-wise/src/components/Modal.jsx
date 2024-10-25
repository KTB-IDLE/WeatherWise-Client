import React from "react";
import "./Modal.css"; // 모달의 스타일을 위한 CSS

const Modal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null; // 모달이 열려있지 않으면 렌더링하지 않음

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <p>{message}</p>
        <button onClick={onClose}>확인</button>
      </div>
    </div>
  );
};

export default Modal;
