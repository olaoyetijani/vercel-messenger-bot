import { parse } from "url";

export default function handler(req, res) {
  const VERIFY_TOKEN = "tijani__secret__token";

  if (req.method === "GET") {
    // Parse query params manually (since req.query doesn't exist)
    const { query } = parse(req.url, true);
    const mode = query["hub.mode"];
    const token = query["hub.verify_token"];
    const challenge = query["hub.challenge"];

    console.log("🔍 Facebook verification request received:");
    console.log("→ hub.mode:", mode);
    console.log("→ hub.verify_token (from Facebook):", token);
    console.log("→ hub.challenge:", challenge);
    console.log("→ Expected VERIFY_TOKEN (in code):", VERIFY_TOKEN);

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ WEBHOOK_VERIFIED — tokens match");
      res.statusCode = 200;
      return res.end(challenge); // plain text response
    } else {
      console.log("❌ Verification failed:");
      if (token !== VERIFY_TOKEN) {
        console.log("   Reason: Token mismatch");
      }
      if (mode !== "subscribe") {
        console.log("   Reason: mode is not 'subscribe'");
      }

      res.statusCode = 403;
      return res.end("Verification failed");
    }
  }

  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        console.log("📩 Webhook Event:", JSON.stringify(data, null, 2));
      } catch (err) {
        console.error("❌ Failed to parse body:", body);
      }

      res.statusCode = 200;
      res.end("EVENT_RECEIVED");
    });
    return;
  }

  res.statusCode = 405;
  res.end("Method not allowed");
}
