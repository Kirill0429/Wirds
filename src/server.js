const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = {
  Kirill: { avatar: "https://via.placeholder.com/100", description: "Привет, я Кирилл!" },
  Alice: { avatar: "https://via.placeholder.com/100", description: "Привет, я Алиса!" }
};

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Чат</title>
        <script src="/socket.io/socket.io.js"></script>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; }
            .chat { max-width: 400px; margin: auto; border: 1px solid #ccc; padding: 10px; }
            .msg { display: flex; align-items: center; margin: 5px 0; }
            .msg img { width: 30px; height: 30px; border-radius: 50%; margin-right: 10px; cursor: pointer; }
            .profile { display: none; position: fixed; top: 20%; left: 50%; transform: translate(-50%, 0); background: #fff; padding: 20px; border: 1px solid #ccc; }
        </style>
    </head>
    <body>
        <h1>Чат</h1>
        <div class="chat" id="chat"></div>
        <input id="message" placeholder="Введите сообщение">
        <button onclick="sendMessage()">Отправить</button>

        <div class="profile" id="profile">
            <h2 id="profileName"></h2>
            <img id="profileAvatar" src="" width="100">
            <p id="profileDesc"></p>
            <button onclick="closeProfile()">Закрыть</button>
        </div>

        <script>
            const socket = io();
            const chat = document.getElementById("chat");

            function sendMessage() {
                let input = document.getElementById("message");
                let text = input.value.trim();
                if (text) {
                    socket.emit("message", { user: "Kirill", text });
                    input.value = "";
                }
            }

            socket.on("message", (msg) => {
                let div = document.createElement("div");
                div.className = "msg";
                div.innerHTML = \`<img src="\${users[msg.user]?.avatar || 'https://via.placeholder.com/100'}" onclick="showProfile('\${msg.user}')"> <b>\${msg.user}:</b> \${msg.text}\`;
                chat.appendChild(div);
            });

            function showProfile(name) {
                document.getElementById("profileName").innerText = name;
                document.getElementById("profileAvatar").src = users[name]?.avatar || "https://via.placeholder.com/100";
                document.getElementById("profileDesc").innerText = users[name]?.description || "Нет описания";
                document.getElementById("profile").style.display = "block";
            }

            function closeProfile() {
                document.getElementById("profile").style.display = "none";
            }
        </script>
    </body>
    </html>
  `);
});

io.on("connection", (socket) => {
  socket.on("message", (msg) => io.emit("message", msg));
});

server.listen(3000, () => console.log("Сервер запущен на http://localhost:3000"));
