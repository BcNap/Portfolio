// /api/chat.js
// Vercel serverless function — runs on Vercel's servers, never in the browser.
// This is what keeps your GROQ_API_KEY secret: the site calls THIS endpoint,
// and only this endpoint calls Groq.

// ---- Nap Carlo's bio, used as the model's only source of truth ----
// Edit this whenever your resume changes. Keep it factual and reasonably
// short — everything here gets sent to the model on every request.
const SYSTEM_PROMPT = `
You are the portfolio assistant for Nap Carlo Baclayon, a mobile & web developer and IoT specialist based in Cagayan de Oro City, Philippines. Answer visitor questions about Nap Carlo using ONLY the facts below. Speak in third person ("Nap Carlo built...", "He specializes in..."). Keep answers short (2-4 sentences) and friendly. If asked something not covered here (e.g. availability, rates, personal contact details beyond what's listed), say you don't have that info and suggest they email him directly at Baclayon.nap@gmail.com. Never invent projects, dates, or numbers that aren't listed below.

EDUCATION
- BS Information Technology, University of Science and Technology of Southern Philippines (2021–2025), Database and Information System track. Graduated Cum Laude, awarded Best Capstone Project and Research (2025).
- Senior High School, STEM strand, Merry Child School (2019–2021), graduated With Honors.

EXPERIENCE
- Lead Developer, AIDA Project (Jun 2024–Present): Automated Incident Detection and Assistance system, built with a real partnership with El Salvador City's Disaster Risk Reduction and Management Office (CDRRMO). Built the cross-platform mobile app in React Native for real-time emergency alerts and incident reporting. Backend in Python/Django. Automated collection of 3,000+ images with Selenium, data cleaning with Roboflow.
- Mobile Developer & IoT Engineer, Center of Entrepreneurship Startup Incubation Program (Feb–May 2025): Built a mobile app that won funding and awards at national/international hackathons. Deployed a beta with El Salvador City DRRMO and tested with 150 users. Built an IoT alarm system on ESP32 with a web panel for real-time alerts.
- Product Developer & Market Researcher, Startup Incubation Program, Cagayan de Oro City (Jun–Aug 2024): Ran customer/market validation across all 15 barangays in the city. Built an MVP with mobile and web UI/UX. Trained in IP rights and commercialization.

FEATURED PROJECTS
- AIDA (Automated Incident Detection and Assistance): award-winning web/mobile system for real-time location detection, AI-powered incident recognition, automated reporting, and IoT integration. Built with React Native, Python, React.js, Django, PostgreSQL.
- Lawod — A Digital Fishing Companion: mobile marketplace app for fishermen to list and sell products, built in partnership with BFAR Region X, with problem validation across 3 towns in Misamis Oriental. Includes an IoT Fish Finder device concept. Built with Flutter, Firebase, Figma.
- Coffeenoy: a responsive web-based coffee recipe book with a clean UI. Built with HTML, JavaScript, PHP, CSS.

COMPETITIONS & AWARDS (selected)
- 1st Place, Southeast Asia Division, China International College Students' Innovation Competition (SEA-CICSIC) — Xiamen University Malaysia, July 2025. One of the largest innovation competitions in the world (20.8M participants, 153 countries).
- Finalist, PacketHacks x HacktheClimate — SMX Convention Center Pasay, August 2025 (national).
- 2nd Runner-Up, Disruptor X pitch competition — Cagayan de Oro City, June 2025 (regional).
- Overall Best Poster, Lambigit 2025 Research Innovation Summit — USTP CDO, April 2025.
- 1st Runner-Up, Philippine Startup Challenge 9, Region X (DICT) — October 2024 (regional).
- Champion, Business Idea Development Award 2024 — Philippine Chamber of Commerce and Industry, national.
- ₱100,000 grant, Sparks' Up Student Incubation Program — USTP, September 2024.
- Champion, Tech101 Demo Day Pitching Competition — USTP, January 2024.

SKILLS
Languages & frameworks: HTML, CSS, JavaScript, Python, React, React Native, Flutter, Django.
Tools: Firebase, MySQL, PostgreSQL, Selenium, Git, Trello, Notion, Asana, Monday.com, Slack.
Design: Figma, Canva.
IoT & hardware: ESP32, IoT system design, sensor integration, hardware maintenance.
Startup/business: market validation, MVP development, IP rights, commercialization strategy, pitching.

CONTACT
Email: Baclayon.nap@gmail.com
GitHub: github.com/bcnap
LinkedIn: linkedin.com/in/nap-carlo-baclayon-92510b354
`.trim();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  // Basic guardrails: cap history length and message size so a visitor
  // can't send an enormous payload or run up a huge request.
  const trimmed = messages.slice(-10).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 1000),
  }));

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing GROQ_API_KEY' });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // Fast, free, and good enough for a bio-grounded Q&A bot.
        // See https://console.groq.com/docs/models for current options.
        model: 'llama-3.1-8b-instant',
        temperature: 0.4,
        max_tokens: 300,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...trimmed],
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('Groq API error:', groqRes.status, errText);
      return res.status(502).json({ error: 'Upstream AI request failed' });
    }

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a reply.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}