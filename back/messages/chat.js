function chat() {
  const express = require("express");
  const cors = require("cors");
  const app = express();
  const http = require("http");
  const { Server } = require("socket.io");
  const server = http.createServer(app);
  const serverPort = 8081;
  const chatController = require("../controllers/chat.controller.js");

  // Gérez les connexions des clients Socket.IO ici
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Keep track of the connected users and their respective channels
  const users = {};

  io.on("connection", async (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("message", (data) => {
      const { channel, message, pseudo, image, idUtilisateur } = data;
      console.log(`New message received in channel ${channel}: ${message}`);

      // Broadcast the message to all users in the channel
      io.emit("receive_message", {
        pseudo: pseudo,
        message: message,
        channel: channel,
        image: image,
        time: new Date(),
      });

      const chatObjet = {
        idRoom: channel, // ou autre valeur appropriée
        texte: message,
        idUtilisateur: idUtilisateur, // ou autre valeur appropriée
      };

      // Enregistrement du message dans la base de données
      chatController.create(
        { body: chatObjet },
        {
          send: () => {}, // vous pouvez remplacer cette fonction vide par une gestion d'erreur ou une logique supplémentaire si nécessaire
          status: () => {
            return { send: () => {} };
          }, // De même ici
        }
      );
    });

    socket.on("disconnect", () => {
      // Leave the channel, if any
      if (users[socket.id] && users[socket.id].channel) {
        socket.leave(users[socket.id].channel);
        console.log(
          `User ${socket.id} left channel ${users[socket.id].channel}`
        );
      }

      console.log(`User Disconnected: ${socket.id}`);
      delete users[socket.id];
    });
  });

  server.listen(serverPort, () => {
    console.log(`Socket.IO on port ${serverPort}`);
  });
}

module.exports = chat;
