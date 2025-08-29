// api/webhook.js
export default function handler(req, res) {
  const VERIFY_TOKEN = "tijani__secret__token";

  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified successfully ✅");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  } else if (req.method === "POST") {
    const body = req.body;

    if (body.object === "page") {
      body.entry.forEach(function (entry) {
        let webhook_event = entry.messaging[0];
        console.log("📩 Received Event:", webhook_event);

        if (webhook_event.message) {
          console.log("💬 Message Text:", webhook_event.message.text);
        }
      });

      res.status(200).send("EVENT_RECEIVED");
    } else {
      res.sendStatus(404);
    }
  } else {
    res.status(200).send("Messenger Webhook is running ✅");
  }
}
