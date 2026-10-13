import terms from "../data/terms.json" with { type: "json" };

const normalize = (value) => String(value ?? "")
  .normalize("NFKC")
  .toLocaleLowerCase("id")
  .replace(/[аеіорсху]/g, ch => ({ "а":"a", "е":"e", "і":"i", "о":"o", "р":"p", "с":"c", "х":"x", "у":"y" }[ch] || ch))
  .replace(/[4@]/g, "a")
  .replace(/[3]/g, "e")
  .replace(/[1!|]/g, "i")
  .replace(/[0]/g, "o")
  .replace(/[5$]/g, "s")
  .replace(/[7]/g, "t")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const compact = (value) => normalize(value).replace(/\s+/g, "");

const normalizedTerms = [...new Set(terms.map(t => ({
  original: t,
  spaced: normalize(t),
  compact: compact(t)
})).filter(t => t.spaced.length >= 3))];

function findMatches(text) {
  const norm = normalize(text);
  const flat = compact(text);
  const tokens = norm.split(/\s+/).filter(Boolean);
  const matches = new Set();

  for (const term of normalizedTerms) {
    // Match whole words/phrases first to reduce false positives.
    if (term.spaced && new RegExp(`(?:^|\\s)${escapeRegExp(term.spaced)}(?:$|\\s)`, "u").test(norm)) {
      matches.add(term.original);
      continue;
    }
    // Catch simple separator/leet obfuscation, with minimum length.
    if (term.compact.length >= 4 && flat.includes(term.compact)) {
      matches.add(term.original);
      continue;
    }
    // Check tokens joined with separators removed (e.g. k.o.n.t.o.l).
    if (term.compact.length >= 4 && tokens.some(t => t.replace(/[^a-z0-9]/g, "").includes(term.compact))) {
      matches.add(term.original);
    }
  }
  return [...matches];
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function censor(text, matches) {
  let output = String(text);
  for (const word of matches.sort((a,b) => b.length - a.length)) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    try {
      output = output.replace(new RegExp(escaped, "giu"), "***");
    } catch {}
  }
  return output;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed", hint: "Use POST with JSON body." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  const text = body?.text;
  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Field 'text' is required and must be a non-empty string." });
  }
  if (text.length > 10000) {
    return res.status(413).json({ error: "Text too long; maximum 10000 characters." });
  }

  const matches = findMatches(text);
  return res.status(200).json({
    ok: true,
    flagged: matches.length > 0,
    count: matches.length,
    matches,
    censored: censor(text, matches),
    dictionarySize: terms.length,
    note: "Blacklist-based detection is not perfect; review false positives and add rate limiting for production."
  });
}
