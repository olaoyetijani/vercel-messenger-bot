export default function handler(req, res) {
  const VERIFY_TOKEN = "EAA54QgkWkaUBPQBPQgppMC7RcRHHxBZBduVt6dsa4J5s5Luh5uSN3FEiiby1QyVJmeZALcJBuyCrd5iiQ4FQYLvXn98mxeElGq2BbqkqrnZAW2HeTAY0JFommuwEonLNrsZBZCsZCDRsfKp4ZCGGG4EFccZBtMgCP1kfZAy6a5jQkdLKTLOr81EQB2ZBMX0G5kMfP1BrZCseEXu"; // choose your own secret token

  if (req.method === "GET") {
    // Verification request from Facebook
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Verification failed");
    }
  } else if (req.method === "POST") {
    // Message events from Facebook
    const body = req.body;
    console.log("Webhook event received:", body);
    return res.status(200).send("EVENT_RECEIVED");
  } else {
    res.status(405).send("Method not allowed");
  }
}
