export const config = {
  api: {
    bodyParser: false, // disable automatic parsing
  },
};

export default async function handler(req, res) {
  const VERIFY_TOKEN = "tijani__secret__token";

  if (req.method === "GET") {
    // Facebook webhook verification
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ WEBHOOK_VERIFIED");
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Verification failed");
    }
  }

  if (req.method === "POST") {
    let body = "";

    // collect raw body
    await new Promise((resolve) => {
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", resolve);
    });

    try {
      const data = JSON.parse(body);
      console.log("📩 Webhook Event:", JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("❌ Failed to parse body:", body);
    }

    return res.status(200).send("EVENT_RECEIVED");
  }

  return res.status(405).send("Method not allowed");
}


