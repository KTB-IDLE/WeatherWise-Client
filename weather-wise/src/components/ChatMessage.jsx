import React from "react";
import PropTypes from "prop-types";
import "./ChatMessages.css";

const ChatMessages = ({ userId, messages }) => {
  return (
    <div className="chat-body">
      {messages.map((content, index) => (
        <div
          key={index}
          className={`message ${
            content.userId === userId ? "own-message" : "other-message"
          }`}
        >
          <p className="message-user">{content.userId}</p>
          <div className="message-content">
            <p>{content.message}</p>
            <span className="message-time">{content.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// PropTypes를 사용하여 데이터 검증
ChatMessages.propTypes = {
  userId: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ChatMessages;
