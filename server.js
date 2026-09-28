const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let incidents = [
  {
    id: "INC-1001",
    title: "Suspicious successful login",
    type: "Credential Attack",
    severity: "Critical",
    status: "Investigating",
    source: "Authentication Logs",
    timestamp: "2026-09-28 09:42",
    details: "Successful login followed 17 failed attempts from an unfamiliar IP address.",
    evidence: ["17 failed logins in 6 minutes", "New IP address", "Successful login after failures"],
    affectedAsset: "Admin Portal"
  },
  {
    id: "INC-1002",
    title: "Suspicious shortened URL",
    type: "Phishing",
    severity: "High",
    status: "Detected",
    source: "Email Gateway",
    timestamp: "2026-09-28 09:18",
    details: "A message contains a shortened URL with indicators commonly associated with credential harvesting.",
    evidence: ["URL shortener", "Newly observed domain", "Login-themed message"],
    affectedAsset: "Mail Gateway"
  },
  {
    id: "INC-1003",
    title: "Unknown executable detected",
    type: "Malware",
    severity: "High",
    status: "Investigating",
    source: "Endpoint Agent",
    timestamp: "2026-09-28 08:56",
    details: "An unsigned executable was launched from a temporary user directory.",
    evidence: ["Unsigned binary", "Temporary directory", "Unusual process behavior"],
    affectedAsset: "WORKSTATION-14"
  },
  {
    id: "INC-1004",
    title: "Repeated failed authentication",
    type: "Brute Force",
    severity: "Medium",
    status: "Monitoring",
    source: "VPN Logs",
    timestamp: "2026-09-28 08:31",
    details: "Multiple failed VPN authentication attempts were observed against one account.",
    evidence: ["26 failures", "Single target account", "Short time window"],
    affectedAsset: "VPN Gateway"
  },
  {
    id: "INC-1005",
    title: "Unusual outbound connection",
    type: "Network Anomaly",
    severity: "Low",
    status: "Resolved",
    source: "Firewall",
    timestamp: "2026-09-28 07:55",
    details: "A workstation contacted an uncommon external destination once.",
    evidence: ["Rare destination", "Single connection", "No repeated activity"],
    affectedAsset: "WORKSTATION-08"
  }
];

function analyzeIncident(input) {
  const text = JSON.stringify(input).toLowerCase();
  let type = "Suspicious Activity";
  let severity = "Medium";
  let confidence = 72;
  let actions = ["Collect additional logs", "Monitor affected asset", "Review related authentication events"];

  if (/phish|url|link|credential|login page/.test(text)) {
    type = "Phishing / Credential Theft";
    severity = /password|credential|login/.test(text) ? "High" : "Medium";
    confidence = 91;
    actions = ["Block or quarantine the URL", "Search mailboxes for matching messages", "Reset exposed credentials if confirmed"];
  } else if (/malware|ransom|trojan|executable|powershell|payload/.test(text)) {
    type = "Malware";
    severity = "High";
    confidence = 94;
    actions = ["Isolate the endpoint", "Collect process and file telemetry", "Scan for persistence and related indicators"];
  } else if (/brute|failed login|authentication|password/.test(text)) {
    type = "Credential Attack";
    severity = "High";
    confidence = 89;
    actions = ["Temporarily block the source", "Require MFA / reset credentials", "Review successful logins around the event"];
  } else if (/ddos|flood|traffic/.test(text)) {
    type = "Network Attack";
    severity = "Critical";
    confidence = 88;
    actions = ["Apply traffic filtering", "Rate-limit the affected service", "Review firewall and edge telemetry"];
  }

  return {
    classification: type,
    severity,
    confidence,
    reasoning: `The agent matched the supplied indicators against incident patterns and found evidence consistent with ${type.toLowerCase()}.`,
    recommendedActions: actions,
    generatedAt: new Date().toISOString()
  };
}

app.get("/api/health", (req, res) => res.json({ ok: true, service: "Incident Response Agent" }));
app.get("/api/incidents", (req, res) => res.json(incidents));

app.get("/api/incidents/:id", (req, res) => {
  const incident = incidents.find(i => i.id === req.params.id);
  if (!incident) return res.status(404).json({ error: "Incident not found" });
  res.json(incident);
});

app.post("/api/analyze", (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Provide incident details to analyze." });
  }
  res.json(analyzeIncident(req.body));
});

app.post("/api/incidents", (req, res) => {
  const analysis = analyzeIncident(req.body);
  const incident = {
    id: `INC-${1000 + incidents.length + 1}`,
    title: req.body.title || "New security incident",
    type: analysis.classification,
    severity: analysis.severity,
    status: "New",
    source: req.body.source || "Manual Input",
    timestamp: new Date().toISOString().slice(0,16).replace("T"," "),
    details: req.body.details || "Incident submitted for analysis.",
    evidence: req.body.evidence ? [req.body.evidence] : [],
    affectedAsset: req.body.affectedAsset || "Unknown"
  };
  incidents.unshift(incident);
  res.status(201).json({ incident, analysis });
});

app.patch("/api/incidents/:id/status", (req, res) => {
  const incident = incidents.find(i => i.id === req.params.id);
  if (!incident) return res.status(404).json({ error: "Incident not found" });
  incident.status = req.body.status || incident.status;
  res.json(incident);
});

app.listen(PORT, () => {
  console.log(`Incident Response Agent API running at http://localhost:${PORT}`);
});