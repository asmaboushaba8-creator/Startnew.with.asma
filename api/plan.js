export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { age, goal, problem, details } = req.body;

  const systemPrompt = `You are a personal coach. Respond ONLY with a valid JSON object. No markdown, no explanation. Use short Arabic sentences only. Never use quotes or apostrophes inside JSON values.`;

  const userPrompt = `Personalized plan for age ${age}, goal: ${goal}, biggest challenge: ${problem}.${details ? " Details: " + details : ""}

Return ONLY this exact JSON:
{"day1_title":"title","day1_task1":"task","day1_task2":"task","day1_task3":"task","week1_hours":"hours per day","week1_focus":"30min focus task","week2":"week 2 plan","week3":"week 3 plan","week4":"week 4 and evaluation","forbidden":"one thing to avoid","tip":"consistency tip"}`;

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
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const data = await response.json();
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
