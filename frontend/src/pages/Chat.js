import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function Chat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setChat((prev) => [...prev, msg]);
    });
    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = async () => {
    const msg = { sender: user._id, receiver, content: message };
    await axios.post("http://localhost:5000/api/messages", msg);
    socket.emit("sendMessage", msg);
    setMessage("");
  };

  return (
    <div>
      <h2>Welcome {user.username}</h2>
      <input placeholder="Receiver ID" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
      <input placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <div>
        {chat.map((m, i) => (
          <p key={i}><b>{m.sender}</b>: {m.content}</p>
        ))}
      </div>
    </div>
  );
}

export default Chat;
