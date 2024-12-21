import "./ChattingInfo.css";
const ChattingInfo = ({ chatRoomName }) => {
  return (
    <div style={{ padding: "10px", textAlign: "center" }}>
      <h2>{chatRoomName}</h2>
    </div>
  );
};

export default ChattingInfo;
