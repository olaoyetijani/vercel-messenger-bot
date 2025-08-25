export default function handler(req, res) {
  res.status(200).json({
    message: "Server is reachable!",
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
  })
}
