
<div align="center">

# RIZZ WORD FILTER API

**REST API for Profanity Detection & Content Moderation**

A lightweight API for detecting blacklisted words, offensive language, slang, and suspicious text patterns.

<br>

[![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![JSON](https://img.shields.io/badge/Response-JSON-3776AB?style=for-the-badge)](#api-reference)

**Fast. Simple. Developer Friendly.**

[Documentation](#documentation) · [API Reference](#api-reference) · [Installation](#installation) · [Examples](#examples)

</div>

---

## Documentation

Rizz Word Filter API is a serverless REST API built with Node.js and Vercel Functions. It allows applications to check text against a local blacklist dictionary and receive detection results in JSON format.

### Features

- Profanity and blacklist detection.
- Text normalization and common obfuscation handling.
- Automatic censored-text output.
- JSON-based dictionary.
- REST API architecture.
- Vercel serverless deployment.
- CORS support.
- JSON responses for easy integration.
- Suitable for websites, chat applications, bots, and moderation systems.

> **Important:** No blacklist can guarantee 100% detection. New slang, uncommon regional terms, deliberate obfuscation, and context-dependent language may bypass detection or produce false positives.

---

## Project Structure

```text
vercel-word-filter-api/
├── api/
│   ├── health.js
│   └── filter.js
├── data/
│   └── terms.json
├── docs/
│   └── index.html
├── package.json
└── README.md
```

| File | Description |
|---|---|
| `api/health.js` | API status endpoint |
| `api/filter.js` | Text filtering endpoint |
| `data/terms.json` | Blacklist dictionary |
| `docs/index.html` | HTML documentation page |
| `package.json` | Project configuration |
| `README.md` | Project documentation |

---

## API Reference

### Base URL

After deploying to Vercel, your API base URL will look like this:

```text
https://YOUR-PROJECT.vercel.app
```

Replace `YOUR-PROJECT` with your actual Vercel project name.

### 1. Health Check

Check whether the API is running.

**Endpoint**

```http
GET /api/health
```

**Example request**

```bash
curl https://YOUR-PROJECT.vercel.app/api/health
```

**Example response**

```json
{
  "ok": true,
  "service": "word-filter-api",
  "version": "1.0.0"
}
```

**Success status:** `200 OK`

---

### 2. Filter Text

Check text against the blacklist dictionary.

**Endpoint**

```http
POST /api/filter
```

**Headers**

```http
Content-Type: application/json
```

**Request body**

```json
{
  "text": "Your text goes here"
}
```

**Example request using cURL**

```bash
curl -X POST "https://YOUR-PROJECT.vercel.app/api/filter" \
  -H "Content-Type: application/json" \
  -d '{"text":"Example text to check"}'
```

**Example response**

```json
{
  "ok": true,
  "flagged": true,
  "count": 1,
  "matches": [
    "example-term"
  ],
  "censored": "*** text to check",
  "dictionarySize": 1529,
  "note": "Blacklist-based detection is not perfect; review false positives and add rate limiting for production."
}
```

The example above illustrates the response format. Actual matches depend on the contents of `data/terms.json` and the submitted text.

### Response fields

| Field | Type | Description |
|---|---|---|
| `ok` | Boolean | Indicates that the request was processed |
| `flagged` | Boolean | Whether a blacklist match was detected |
| `count` | Number | Number of unique matched dictionary entries |
| `matches` | Array | Matched dictionary terms |
| `censored` | String | Text with detected terms replaced where supported |
| `dictionarySize` | Number | Number of dictionary entries loaded |
| `note` | String | Detection limitations and operational guidance |

### HTTP status codes

| Status | Meaning |
|---|---|
| `200` | Request processed successfully |
| `400` | Missing or invalid text |
| `405` | HTTP method not supported |
| `413` | Text exceeds the maximum length |
| `500` | Unexpected server error |

---

## Installation

### Requirements

- Node.js
- npm
- A GitHub account
- A Vercel account

### 1. Download the project

Download or clone the repository to your computer.

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd vercel-word-filter-api
```

### 2. Install the Vercel CLI

```bash
npm install
npm install -g vercel
```

### 3. Run locally

```bash
vercel dev
```

The local development server will display its URL, commonly:

```text
http://localhost:3000
```

Test the endpoints:

```text
http://localhost:3000/api/health
http://localhost:3000/api/filter
```

The filter endpoint requires a `POST` request with a JSON body.

---

## Deploy to Vercel

### Method A — GitHub deployment

1. Create a new repository on GitHub.
2. Upload the project files and folders.
3. Open [Vercel](https://vercel.com/).
4. Sign in with GitHub.
5. Select **Add New → Project**.
6. Import your repository.
7. Select the appropriate project settings.
8. Click **Deploy**.
9. Wait for deployment to complete.
10. Open your deployment URL and test `/api/health`.

Your API endpoints will be available at:

```text
https://YOUR-PROJECT.vercel.app/api/health
https://YOUR-PROJECT.vercel.app/api/filter
```

### Method B — Vercel CLI

From the project directory:

```bash
vercel login
vercel
```

For a production deployment:

```bash
vercel --prod
```

Follow the CLI prompts and verify the generated deployment URL.

---

## Examples

### JavaScript — Fetch API

```javascript
const API_URL = "https://YOUR-PROJECT.vercel.app";

async function checkText(text) {
  const response = await fetch(`${API_URL}/api/filter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Request failed");
  }

  return result;
}

checkText("Text to moderate")
  .then(result => {
    console.log("Flagged:", result.flagged);
    console.log("Matches:", result.matches);
    console.log("Censored:", result.censored);
  })
  .catch(console.error);
```

### Node.js

```javascript
const API_URL = "https://YOUR-PROJECT.vercel.app";

async function moderateMessage(message) {
  const response = await fetch(`${API_URL}/api/filter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: message })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

const result = await moderateMessage("Message to check");

if (result.flagged) {
  console.log("Message requires moderation");
  console.log(result.matches);
} else {
  console.log("No blacklist match detected");
}
```

### Browser integration

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Word Filter Demo</title>
</head>
<body>
  <textarea id="message" placeholder="Enter text to check"></textarea>
  <button id="check">Check text</button>
  <pre id="result"></pre>

  <script>
    const API_URL = "https://YOUR-PROJECT.vercel.app";

    document.getElementById("check").addEventListener("click", async () => {
      const text = document.getElementById("message").value;
      const output = document.getElementById("result");

      try {
        const response = await fetch(`${API_URL}/api/filter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        });

        const data = await response.json();
        output.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        output.textContent = `Error: ${error.message}`;
      }
    });
  </script>
</body>
</html>
```

---

## Dictionary Management

The dictionary is stored in:

```text
data/terms.json
```

Add new entries to the JSON array, for example:

```json
[
  "example-term",
  "another-example"
]
```

Preserve valid JSON syntax and the array structure expected by the application. Commit and redeploy the project after changing the dictionary.

### Dictionary guidelines

- Review new terms before adding them.
- Include relevant regional slang and common spelling variants.
- Avoid broad substrings that may match innocent words.
- Test false positives and false negatives.
- Do not assume every occurrence of a sensitive word is abusive.
- Keep a clear record of dictionary updates.

---

## Error Handling

A missing `text` field returns a `400` response.

**Request**

```json
{}
```

**Example response**

```json
{
  "error": "Field 'text' is required and must be a non-empty string."
}
```

Requests using a method other than `POST` on `/api/filter` return `405`.

Requests with text longer than the configured maximum of 10,000 characters return `413`.

---

## Security & Limitations

This project is a starting point for content moderation, not a complete anti-abuse security platform.

For production deployments:

- Restrict CORS to trusted origins when browser access is required.
- Add rate limiting to reduce abuse and unexpected usage.
- Add authentication if access should be limited.
- Avoid logging private user messages unnecessarily.
- Review false positives before taking irreversible actions.
- Consider moderation queues for uncertain results.
- Monitor serverless usage and platform limits.
- Do not expose API secrets in browser-side JavaScript.
- Use a database or external storage if dictionary updates must persist at runtime.

**Detection is not guaranteed to be complete.** Blacklist matching can miss novel obfuscations, languages, or phrases that are absent from the dictionary. A detected term may also be harmless in context.

---

## FAQ

### Is this a public API?

After deployment, the endpoints are reachable through your Vercel URL unless you add access controls.

### Do I need to run a server 24/7?

No. Vercel Functions execute on demand according to the platform's serverless model.

### Can I use it in a chat application?

Yes. Send the message to `/api/filter`, inspect `flagged`, and decide whether to allow, censor, or review the message.

### Can I add more words?

Yes. Edit `data/terms.json`, validate the JSON, and redeploy.

### Does it guarantee zero bypasses?

No. No static blacklist can guarantee that every abusive expression or spelling variation will be detected.

---

## License

Choose and add a license before distributing this project. Also verify the licensing terms of any third-party dictionaries you incorporate.

---

<div align="center">

**RIZZ WORD FILTER API**

Built for developers who need a simple starting point for text moderation.

</div>
