export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { message, history, fach } = req.body;
    const contents = [];
    if (history && history.length) {
      history.forEach(h => {
        contents.push({ role: h.role, parts: [{ text: h.text }] });
      });
    }
    contents.push({ role: 'user', parts: [{ text: '[' + fach + '] ' + message }] });
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: 'Du bist ein Nachhilfelehrer fuer die ZP10 in NRW, Klasse 10. Hilf bei Mathe, Deutsch und Englisch. Antworte klar und freundlich, maximal 220 Woerter. Auf Deutsch ausser bei Englisch-Fragen.' }] },
          contents: contents,
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
        })
      }
    );
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Keine Antwort erhalten.';
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: 'Fehler: ' + e.message });
  }
}
