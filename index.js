import axios from "axios";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const TELEGRAM_API_TOKEN = `7618869959:AAFu_GTW0_p41b2GwM2WgLBqLkcvRVw5dL8`;
const GEMINI_API_KEY = "AIzaSyDr49uAU13FwTyaJInQ5JZlVKX1ZupC9tA"; // Replace with your actual API key
const PORT = "8000";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define the route for Telegram bot interaction
app.post("/new-message", (req, res) => {
  const { message } = req.body;

  // Check if the message contains "marco"
  if (!message) {
    return res.end();
  }

  // Send the message to Gemini API for AI-generated content
  axios
    .post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are a helpful assistant named ToLax. Reply to the following message: "${message}"`,
              },
            ],
          },
        ],
      }
    )
    .then((geminiResponse) => {
      // Extract the generated response from Gemini
      const aiReply =
        geminiResponse.data.contents[0].parts[0].text ||
        "Sorry, I couldn't generate a response.";

      // Send the AI-generated response to Telegram
      axios
        .post(`https://api.telegram.org/bot${TELEGRAM_API_TOKEN}/sendMessage`, {
          chat_id: message.chat.id,
          text: aiReply,
        })
        .then(() => {
          console.log("Telegram message posted");
          res.end("ok");
        })
        .catch((telegramErr) => {
          console.log("Telegram Error:", telegramErr);
          res.end("Error: " + telegramErr);
        });
    })
    .catch((geminiError) => {
      console.log("Gemini Error:", geminiError);
      res.end("Error: " + geminiError);
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Telegram app listening on port ${PORT}!`);
});
