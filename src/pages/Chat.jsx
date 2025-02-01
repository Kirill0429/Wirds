import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  const sendMessage = () => {
    if (input) {
      socket.emit("message", { text: input, user: "Kirill" });
      setInput("");
    }
  };

  return (
    <div>
      <h2>Чат</h2>
      <div>
        {messages.map((msg, i) => (
          <p key={i}>
            <Link to={`/profile/${msg.user}`}>{msg.user}</Link>: {msg.text}
          </p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Отправить</button>
    </div>
  );
}

export default Chat;
