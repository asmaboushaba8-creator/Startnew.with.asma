export default async function handler(req, res) {
  // Test: check if API key exists
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "API key missing" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { age, goal, problem, details } = req.body || {};

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 800,
        system: "You are a personal coach. Respond ONLY with valid JSON. No markdown. Short Arabic sentences. No quotes inside values.",
        messages: [{
          role: "user",
          content: `Plan for age ${age}, goal: ${goal}, challenge: ${problem}.${details ? " " + details : ""} Return ONLY: {"day1_title":"...","day1_task1":"...","day1_task2":"...","day1_task3":"...","week1_hours":"...","week1_focus":"...","week2":"...","week3":"...","week4":"...","forbidden":"...","tip":"..."}`
        }],
      }),
    });

    const text = await response.text();
    
    if (!response.ok) {
      return res.status(500).json({ error: "Anthropic error: " + text });
    }

    const data = JSON.parse(text);
    const raw = (data.content || []).map((b) => b.text || "").join("");
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: "No JSON in response" });

    let str = match[0].replace(/[\x00-\x1F\x7F]/g, " ");
    try {
      return res.status(200).json(JSON.parse(str));
    } catch {
      str = str.replace(/,\s*([}\]])/g, "$1");
      return res.status(200).json(JSON.parse(str));
    }
  } catch (e) {
    return res.status(500).json({ error: "Fetch failed: " + e.message });
  }
}
