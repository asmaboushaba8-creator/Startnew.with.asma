import { useState } from "react";

const GOALS = [
  { label: "🎓 باك", val: "اجتياز شهادة البكالوريا" },
  { label: "📚 جامعة", val: "النجاح في الجامعة" },
  { label: "🚀 مشروع", val: "إطلاق مشروع شخصي" },
  { label: "🌍 لغة", val: "تعلم لغة جديدة" },
  { label: "💪 عادات", val: "بناء عادات صحية" },
  { label: "💼 عمل", val: "إيجاد عمل أو وظيفة" },
  { label: "💻 تقنية", val: "تطوير مهارة تقنية" },
  { label: "✍️ كتابة", val: "كتابة كتاب أو محتوى" },
];

const PROBLEMS = [
  { label: "😵 متشتت", val: "التشتت وعدم التركيز" },
  { label: "⏳ نأجل بزاف", val: "التسويف والتأجيل المستمر" },
  { label: "🕐 نضيع الوقت", val: "إضاعة الوقت بدون فائدة" },
  { label: "🤷 ما نعرفش منين نبدا", val: "عدم معرفة نقطة البداية" },
  { label: "🔥 نفقد الحماس بسرعة", val: "فقدان الحماس والاستمرارية" },
];

const stepColors = ["#4facfe", "#a18dfe", "#43e97b"];

export default function App() {
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");
  const [problem, setProblem] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setError("");
    if (!age || isNaN(Number(age)) || Number(age) < 10 || Number(age) > 80) {
      setError("من فضلك أدخل عمرك بشكل صحيح"); return;
    }
    if (!goal) { setError("اختر هدفك من الخيارات"); return; }
    if (!problem) { setError("اختر أكبر مشكلة تواجهك"); return; }
    setLoading(true);
    setPlan(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age, goal, problem, details: details.replace(/['"]/g, " ") }),
      });
      if (!res.ok) throw new Error("خطأ في الاتصال");
      const data = await res.json();
      if (!data.day1_title) throw new Error("تعذّر قراءة الخطة");
      setPlan(data);
    } catch (e) {
      setError(e.message || "حصل خطأ غير متوقع");
    }
    setLoading(false);
  }

  function getPlanText() {
    return `🚀 خارطة البداية
👤 العمر: ${age} سنة
🎯 الهدف: ${goal}
⚡ التحدي: ${problem}

━━ اليوم الأول ━━
${plan.day1_title}
1️⃣ ${plan.day1_task1}
2️⃣ ${plan.day1_task2}
3️⃣ ${plan.day1_task3}

━━ الأسبوع الأول ━━
⏰ ${plan.week1_hours}
🎯 30 دقيقة: ${plan.week1_focus}

الأسبوع 2: ${plan.week2}
الأسبوع 3: ${plan.week3}
الأسبوع 4: ${plan.week4}

❌ ممنوع: ${plan.forbidden}
🎯 ${plan.tip}

🎯 ركز على الاستمرارية مشي الكمال.`;
  }

  function copyPlan() {
    const text = getPlanText();
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch {}
      document.body.removeChild(ta);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); })
        .catch(fallback);
    } else fallback();
  }

  function downloadPlan() {
    const blob = new Blob([getPlanText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "خارطة-البداية.txt"; a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setPlan(null); setGoal(""); setProblem(""); setAge(""); setDetails(""); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const inp = { width: "100%", background: "#0d0f14", border: "1px solid #1f2330", borderRadius: ".6rem", color: "#eceef5", fontFamily: "inherit", fontSize: "1rem", padding: ".7rem 1rem", outline: "none", boxSizing: "border-box" };
  const lbl = { display: "block", fontSize: ".68rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#888", marginBottom: ".6rem" };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f14", color: "#eceef5", fontFamily: "system-ui,sans-serif", padding: "2rem 1rem 3rem" }}>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ display: "inline-block", fontSize: ".68rem", fontWeight: 700, letterSpacing: ".15em", color: "#f5a623", border: "1px solid #f5a62340", padding: ".3rem .9rem", borderRadius: "2rem", marginBottom: "1.2rem", background: "#f5a6230d" }}>✦ START NOW</div>
        <h1 style={{ fontSize: "clamp(1.5rem,5vw,2.5rem)", fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
          🚀 من التشتت إلى <span style={{ color: "#f5a623" }}>أول خطوة</span>
          <br /><span style={{ fontSize: "clamp(.95rem,3vw,1.5rem)", color: "#c8ccda", fontWeight: 400 }}>في أقل من دقيقة</span>
        </h1>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", background: "#13161e", border: "1px solid #1f2330", borderRadius: "1.2rem", padding: "1.8rem" }}>

        <div style={{ marginBottom: "1.2rem" }}>
          <label style={lbl}>عمرك</label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="مثال: 20" min={10} max={80} style={inp} />
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <label style={lbl}>هدفك الرئيسي</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
            {GOALS.map(g => (
              <button key={g.val} onClick={() => setGoal(g.val)} style={{ fontSize: ".78rem", padding: ".35rem .8rem", borderRadius: "2rem", border: `1px solid ${goal === g.val ? "#f5a623" : "#1f2330"}`, cursor: "pointer", color: goal === g.val ? "#0d0f14" : "#c8ccda", background: goal === g.val ? "#f5a623" : "transparent", fontFamily: "inherit", fontWeight: goal === g.val ? 700 : 400 }}>{g.label}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <label style={lbl}>أكبر مشكلة تواجهك؟</label>
          <div style={{ display: "flex", flexDirection: "column", gap: ".45rem" }}>
            {PROBLEMS.map(p => (
              <button key={p.val} onClick={() => setProblem(p.val)} style={{ fontSize: ".88rem", padding: ".5rem 1rem", borderRadius: ".6rem", textAlign: "right", border: `1px solid ${problem === p.val ? "#f5a623" : "#1f2330"}`, cursor: "pointer", color: problem === p.val ? "#0d0f14" : "#c8ccda", background: problem === p.val ? "#f5a623" : "#0d0f14", fontFamily: "inherit", fontWeight: problem === p.val ? 700 : 400, display: "flex", alignItems: "center", gap: ".6rem" }}>
                <span style={{ width: 13, height: 13, borderRadius: "50%", border: `2px solid ${problem === p.val ? "#0d0f14" : "#3a3f52"}`, flexShrink: 0 }} />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <label style={lbl}>تفاصيل <span style={{ color: "#3a3f52", fontWeight: 400 }}>(اختياري)</span></label>
          <textarea value={details} onChange={e => setDetails(e.target.value)} placeholder="مثال: عندي 3 ساعات في اليوم..." rows={2} style={{ ...inp, resize: "none", lineHeight: 1.6, fontSize: ".9rem" }} />
        </div>

        {error && <div style={{ background: "#2a1515", border: "1px solid #5a2020", borderRadius: ".6rem", padding: ".8rem 1rem", color: "#ff8080", fontSize: ".85rem", marginBottom: "1rem" }}>⚠️ {error}</div>}

        <button onClick={generate} disabled={loading} style={{ width: "100%", padding: ".85rem", border: "none", borderRadius: ".7rem", background: loading ? "#6b4a0f" : "#f5a623", color: "#0d0f14", fontSize: "1rem", fontWeight: 700, fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "⏳ نحضر خطتك…" : "ابدأ الآن ←"}
        </button>
      </div>

      {plan && (
        <div style={{ maxWidth: 520, margin: "2rem auto 0" }}>
          <div style={{ background: "#13161e", border: "1px solid #1f2330", borderRadius: "1.2rem", padding: "1.6rem", marginBottom: "1rem" }}>
            <div style={{ borderBottom: "1px solid #1f2330", paddingBottom: "1rem", marginBottom: "1.2rem" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f5a623", marginBottom: ".5rem" }}>🚀 خارطة البداية</div>
              <div style={{ fontSize: ".85rem", color: "#c8ccda", lineHeight: 1.9 }}>
                👤 العمر: <strong style={{ color: "#eceef5" }}>{age} سنة</strong><br />
                🎯 الهدف: <strong style={{ color: "#eceef5" }}>{goal}</strong><br />
                ⚡ التحدي: <strong style={{ color: "#eceef5" }}>{problem}</strong>
              </div>
            </div>

            <div style={{ fontSize: ".6rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#4facfe", marginBottom: ".6rem" }}>━━ اليوم الأول ━━</div>
            <div style={{ fontWeight: 600, fontSize: ".97rem", marginBottom: ".7rem" }}>{plan.day1_title}</div>
            <div style={{ fontSize: ".75rem", color: "#888", fontWeight: 600, marginBottom: ".5rem" }}>حدد 3 أولويات:</div>
            {[plan.day1_task1, plan.day1_task2, plan.day1_task3].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: ".6rem", marginBottom: ".5rem" }}>
                <span style={{ color: stepColors[i], fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ fontSize: ".87rem", color: "#c8ccda", lineHeight: 1.55 }}>{t}</span>
              </div>
            ))}

            <div style={{ background: "#0d0f14", borderRadius: ".8rem", padding: "1rem", border: "1px solid #1f2330", margin: "1rem 0" }}>
              <div style={{ fontSize: ".6rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#a18dfe", marginBottom: ".6rem" }}>━━ الأسبوع الأول ━━</div>
              <div style={{ fontSize: ".87rem", color: "#c8ccda", lineHeight: 1.7 }}>
                ⏰ <strong style={{ color: "#eceef5" }}>{plan.week1_hours}</strong><br />
                🎯 30 دقيقة: {plan.week1_focus}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: ".6rem", marginBottom: "1rem" }}>
              {[{ l: "الأسبوع 2", v: plan.week2 }, { l: "الأسبوع 3", v: plan.week3 }, { l: "الأسبوع 4", v: plan.week4 }].map((w, i) => (
                <div key={i} style={{ background: "#0d0f14", borderRadius: ".6rem", padding: ".8rem", border: "1px solid #1f2330" }}>
                  <div style={{ fontSize: ".58rem", fontWeight: 700, textTransform: "uppercase", color: "#3a3f52", marginBottom: ".4rem" }}>{w.l}</div>
                  <p style={{ fontSize: ".78rem", color: "#c8ccda", lineHeight: 1.5, margin: 0 }}>{w.v}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "#1a0f0f", border: "1px solid #3a1515", borderRadius: ".7rem", padding: ".85rem 1rem", marginBottom: ".8rem" }}>
              <div style={{ fontSize: ".72rem", color: "#ff7070", fontWeight: 600, marginBottom: ".3rem" }}>ممنوع:</div>
              <div style={{ fontSize: ".85rem", color: "#ffaaaa" }}>❌ {plan.forbidden}</div>
            </div>

            <div style={{ background: "#0f1a0f", border: "1px solid #1a3a1a", borderRadius: ".7rem", padding: ".85rem 1rem" }}>
              <div style={{ fontSize: ".72rem", color: "#43e97b", fontWeight: 600, marginBottom: ".3rem" }}>نصيحة:</div>
              <div style={{ fontSize: ".85rem", color: "#aaffcc" }}>🎯 {plan.tip}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".7rem", marginBottom: "1rem" }}>
            <button onClick={copyPlan} style={{ padding: ".75rem", border: "1px solid #1f2330", borderRadius: ".7rem", background: copied ? "#1a3a1a" : "#13161e", color: copied ? "#43e97b" : "#eceef5", fontFamily: "inherit", fontSize: ".85rem", fontWeight: 600, cursor: "pointer" }}>
              {copied ? "✅ تم النسخ!" : "📸 انسخ وشارك"}
            </button>
            <button onClick={downloadPlan} style={{ padding: ".75rem", border: "none", borderRadius: ".7rem", background: "#f5a623", color: "#0d0f14", fontFamily: "inherit", fontSize: ".85rem", fontWeight: 700, cursor: "pointer" }}>
              📥 حمّل خطتك
            </button>
          </div>
          <button onClick={reset} style={{ display: "block", margin: "0 auto", background: "transparent", border: "1px solid #1f2330", borderRadius: ".6rem", color: "#888", fontFamily: "inherit", fontSize: ".82rem", padding: ".5rem 1.2rem", cursor: "pointer" }}>
            ← جرب هدف آخر
          </button>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "2.5rem", fontSize: ".8rem", color: "#3a3f52", fontWeight: 500 }}>
        🎯 ركز على الاستمرارية مشي الكمال.
      </div>
    </div>
  );
      }
