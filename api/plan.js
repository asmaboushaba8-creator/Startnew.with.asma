export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body;
  try {
    body = req.body;
  } catch {
    return res.status(400).json({ error: "Bad request" });
  }

  const { age, goal, problem, details } = body;

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
        system: "You are a personal coach. Respond ONLY with a valid JSON object. No markdown. Use short Arabic sentences. Never use quotes inside JSON values.",
        messages: [{
          role: "user",
          content: `Plan for age ${age}, goal: ${goal}, challenge: ${problem}.${details ? " Details: " + details : ""} Return ONLY this JSON: {"day1_title":"...","day1_task1":"...","day1_task2":"...","day1_task3":"...","week1_hours":"...","week1_focus":"...","week2":"...","week3":"...","week4":"...","forbidden":"...","tip":"..."}`
        }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const raw = (data.content || []).map((b) => b.text || "").join("");
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: "فشل التوليد" });

    let str = match[0].replace(/[\x00-\x1F\x7F]/g, " ");
    try {
      return res.status(200).json(JSON.parse(str));
    } catch {
      str = str.replace(/,\s*([}\]])/g, "$1");
      return res.status(200).json(JSON.parse(str));
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
