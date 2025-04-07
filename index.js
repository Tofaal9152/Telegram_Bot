import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import axios from "axios";

dotenv.config();

const app = express();
const TELEGRAM_API_TOKEN = `7618869959:AAFu_GTW0_p41b2GwM2WgLBqLkcvRVw5dL8`;
const PORT = "8000";

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define the route
app.post("/new-message", (req, res) => {
  const { message } = req.body;

  if (!message || message.text.toLowerCase().indexOf("marco") < 0) {
    return res.end();
  }

  axios
    .post(`https://api.telegram.org/bot${TELEGRAM_API_TOKEN}/sendMessage`, {
      chat_id: message.chat.id,
      text: "Polo!!",
    })
    .then((response) => {
      console.log("Message posted");
      res.end("ok");
    })
    .catch((err) => {
      console.log("Error:", err);
      res.end("Error: " + err);
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Telegram app listening on port ${PORT}!`);
});
