export default function handler(req, res) {
  const VERIFY_TOKEN = "tijani__secret__token"

  // Set CORS headers for webhook requests
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "GET") {
    // Verification request from Facebook
    const mode = req.query["hub.mode"]
    const token = req.query["hub.verify_token"]
    const challenge = req.query["hub.challenge"]

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED")
      return res.status(200).send(challenge)
    } else {
      console.log("Verification failed - mode:", mode, "token:", token)
      return res.status(403).send("Verification failed")
    }
  } else if (req.method === "POST") {
    const body = req.body
    console.log("Webhook message received from Facebook:")
    console.log("Timestamp:", new Date().toISOString())
    console.log("Body:", JSON.stringify(body, null, 2))

    if (body.object === "page") {
      body.entry?.forEach((entry) => {
        entry.messaging?.forEach((event) => {
          if (event.message) {
            console.log("New message received:")
            console.log("- From:", event.sender.id)
            console.log("- Text:", event.message.text)
            console.log("- Timestamp:", event.timestamp)
          }
          if (event.postback) {
            console.log("Postback received:")
            console.log("- From:", event.sender.id)
            console.log("- Payload:", event.postback.payload)
          }
        })
      })
    }

    return res.status(200).send("EVENT_RECEIVED")
  } else {
    return res.status(405).send("Method not allowed")
  }
}
