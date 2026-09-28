# Incident Response Agent — Working Prototype

A local hackathon prototype with:
- React-style single-page dashboard (plain HTML/CSS/JS for zero frontend build step)
- Node.js + Express backend
- Rule-based AI analysis engine that can be replaced by an LLM/API
- Sample security incidents
- Incident creation and severity classification
- Response recommendations

## Requirements
Node.js 18+.

## Run

1. Open this folder in VS Code.
2. Open a terminal:
   ```bash
   npm install
   npm start
   ```
3. Open `client/index.html` in a browser.

For the easiest local serving method, use VS Code's Live Server extension on `client/index.html`, or run:
```bash
npx serve client -l 5500
```
Then open the URL printed by `serve`.

Backend:
http://localhost:5000

Health check:
http://localhost:5000/api/health

## Demo
1. View the sample incidents.
2. Click **Analyze Event**.
3. Enter:
   - Title: Suspicious login
   - Details: "20 failed login attempts followed by a successful login from an unfamiliar IP address."
4. Click **Analyze with AI**.
5. Review classification, severity, confidence and recommended response.
6. Click **Create Incident**.

## API
GET /api/incidents
GET /api/incidents/:id
POST /api/analyze
POST /api/incidents
PATCH /api/incidents/:id/status

## Important
This is a demonstration prototype. It does not actually block IPs, isolate machines, delete files, reset accounts, or perform other real security actions. The "AI" is a local deterministic analysis engine so the prototype works without an API key.

To connect a real AI provider, replace `analyzeIncident()` in `server.js` with a server-side API call and keep API keys out of the browser.
