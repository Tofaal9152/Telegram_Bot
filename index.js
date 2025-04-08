import axios from "axios";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const TELEGRAM_API_TOKEN = `7618869959:AAFu_GTW0_p41b2GwM2WgLBqLkcvRVw5dL8`;
const PORT = "8000";
const GOOGLE_API_KEY = "AIzaSyDr49uAU13FwTyaJInQ5JZlVKX1ZupC9tA";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define the route
app.post("/new-message", async (req, res) => {
  let responseData = null;
  const { message } = req.body;
  if (!message || !message.text) {
    responseData = "No message text found";
    return res.end(); // Ignore non-text messages
  }

  try {
    // Google API request
    const googleResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are an advanced AI model called Tolax, designed to understand and process human communication efficiently. Your goal is to provide helpful, engaging, and accurate responses. Please process the following message and respond with the most relevant and thoughtful reply based on the context, ensuring that your answer is both clear and concise: 
                Message: ${message.text}`,
              },
            ],
          },
        ],
      }
    );
    responseData = googleResponse.data.candidates[0].content.parts[0].text;

    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}/sendMessage`,
      {
        chat_id: message.chat.id,
        text: responseData,
      }
    );

    res.send("ok");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error: " + err.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Telegram app listening on port ${PORT}!`);
});
