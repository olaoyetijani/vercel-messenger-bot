// api/webhook.js
import fetch from "node-fetch"; // make sure node-fetch is available (Vercel supports it)

const VERIFY_TOKEN = "tijani__secret__token";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN; // keep your token secret

export async function sendMessage(senderId, text) {
  const res = await fetch("https://graph.facebook.com/v21.0/me/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${PAGE_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      recipient: { id: senderId },
      message: { text },
    }),
  });

  const data = await res.json();
  console.log("Send API Response:", data);
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified successfully ✅");
        return res.status(200).send(challenge);
      } else {
        return res.sendStatus(403);
      }
    }
  } else if (req.method === "POST") {
    const body = req.body;

    if (body.object === "page") {
      body.entry.forEach(async function (entry) {
        let webhook_event = entry.messaging[0];
        console.log("📩 Received Event:", webhook_event);

        if (webhook_event.message) {
          const senderId = webhook_event.sender.id;
          const messageText = webhook_event.message.text;

          console.log("💬 Message Text:", messageText);

          // 👇 Auto reply
          await sendMessage(senderId, `You said: "${messageText}"`);
        }
      });

      return res.status(200).send("EVENT_RECEIVED");
    } else {
      return res.sendStatus(404);
    }
  } else {
    return res.status(200).send("Messenger Webhook is running ✅");
  }
}
