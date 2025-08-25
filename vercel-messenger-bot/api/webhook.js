export default function handler(req, res) {
  const VERIFY_TOKEN = "tijani__secret__token"

  if (req.method === "GET") {
    // Verification request from Facebook
    const mode = req.query["hub.mode"]
    const token = req.query["hub.verify_token"]
    const challenge = req.query["hub.challenge"]

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED")
      return res.status(200).send(challenge)
    } else {
      return res.status(403).send("Verification failed")
    }
  } else if (req.method === "POST") {
    // Message events from Facebook
    const body = req.body
    console.log("Webhook event received:", body)
    return res.status(200).send("EVENT_RECEIVED")
  } else {
    res.status(405).send("Method not allowed")
  }
}

