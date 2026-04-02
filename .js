const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(express.static("public"));

let users = [];
let reservas = [];

// REGISTRO
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const existe = users.find(u => u.username === username);
  if (existe) return res.json({ success: false });

  users.push({ username, password, reservas: [] });
  res.json({ success: true });
});

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);

  if (!user) return res.json({ error: "no registrado" });
  if (user.password !== password)
    return res.json({ error: "contraseña incorrecta" });

  res.json({ success: true, user });
});

// RESERVA
app.post("/reserva", (req, res) => {
  const { username, reserva } = req.body;

  let user = users.find(u => u.username === username);

  if (user.reservas.length >= 2)
    return res.json({ error: "limite" });

  user.reservas.push(reserva);
  res.json({ success: true });
});

// CHAT TIEMPO REAL
io.on("connection", (socket) => {
  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("mensaje", ({ room, msg }) => {
    io.to(room).emit("mensaje", msg);
  });
});

server.listen(3000, () =>
  console.log("Servidor en http://localhost:3000")
);