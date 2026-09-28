const API = "/api";

function esc(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function badge(v){return `<span class="badge ${v.toLowerCase()}">${esc(v)}</span>`}

async function loadIncidents(){
  const res=await fetch(`${API}/incidents`);
  const data=await res.json();
  document.getElementById("critical").textContent=data.filter(x=>x.severity==="Critical").length;
  document.getElementById("high").textContent=data.filter(x=>x.severity==="High").length;
  document.getElementById("medium").textContent=data.filter(x=>x.severity==="Medium").length;
  document.getElementById("resolved").textContent=data.filter(x=>x.status==="Resolved").length;
  document.getElementById("incidentRows").innerHTML=data.map(x=>`
    <tr><td><b>${esc(x.id)}</b><br>${esc(x.title)}</td><td>${esc(x.type)}</td><td>${badge(x.severity)}</td><td class="status">${esc(x.status)}</td><td>${esc(x.source)}</td><td>${esc(x.timestamp)}</td></tr>
  `).join("");
}

document.getElementById("analyzeForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const result=document.getElementById("result");
  result.innerHTML='<div class="empty">Analyzing incident…</div>';
  const payload={
    title:document.getElementById("title").value,
    source:document.getElementById("source").value,
    details:document.getElementById("details").value
  };
  const res=await fetch(`${API}/analyze`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  const a=await res.json();
  result.innerHTML=`
    <div class="ai-result">
      <div class="eyebrow">AI ANALYSIS RESULT</div>
      <h3>${esc(a.classification)}</h3>
      <p>Severity: ${badge(a.severity)}</p>
      <div class="confidence">${a.confidence}% <span style="font-size:13px;color:#7f92aa">confidence</span></div>
      <div class="bar"><span style="width:${a.confidence}%"></span></div>
      <p>${esc(a.reasoning)}</p>
      <h4>Recommended response</h4>
      <ul>${a.recommendedActions.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
      <button onclick="createIncident()">Create Incident</button>
    </div>`;
  window.lastAnalysis={payload,a};
});

async function createIncident(){
  if(!window.lastAnalysis)return;
  const {payload}=window.lastAnalysis;
  const res=await fetch(`${API}/incidents`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  const out=await res.json();
  document.getElementById("result").insertAdjacentHTML("beforeend",`<p style="color:#6ed89b"><b>✓ ${esc(out.incident.id)} created successfully.</b></p>`);
  loadIncidents();
}

function scrollToAnalyzer(){document.getElementById("analyzer").scrollIntoView({behavior:"smooth"});}
loadIncidents();
