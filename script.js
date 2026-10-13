// Sample data (class project)
const stats = {
  all:    {orders:1250, delivered:1080, transit:120, delayed:50, ontime:94.2, excursions:7, util:81},
  pharma: {orders:340,  delivered:310,  transit:25,  delayed:5,  ontime:97.1, excursions:1, util:88},
  dairy:  {orders:520,  delivered:450,  transit:48,  delayed:22, ontime:92.6, excursions:4, util:79},
  seafood:{orders:390,  delivered:320,  transit:47,  delayed:23, ontime:91.0, excursions:2, util:76}
};
const week = {
  all:[93,95,92,96,94,91,95], pharma:[97,98,96,98,97,96,98],
  dairy:[92,94,91,95,93,90,94], seafood:[90,93,89,94,91,88,92]
};
const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function renderKpis(f){
  const s = stats[f];
  const items = [
    ["Total orders", s.orders, ""],
    ["Delivered", s.delivered, ""],
    ["In transit", s.transit, ""],
    ["Delayed", s.delayed, "warn"],
    ["On-time delivery", s.ontime + "%", ""],
    ["Temperature excursions", s.excursions, "bad"],
    ["Reefer fleet utilisation", s.util + "%", ""]
  ];
  document.getElementById("kpis").innerHTML = items.map(
    ([l,v,c]) => `<div class="kpi ${c}"><b>${v}</b><span>${l}</span></div>`).join("");
}

function renderChart(f){
  const data = week[f], W = 640, H = 240, pad = 30, bw = 52;
  const step = (W - pad*2) / data.length;
  const min = 80, max = 100;
  let svg = `<svg viewBox="0 0 ${W} ${H}">`;
  [80,85,90,95,100].forEach(t => {
    const y = H - pad - ((t-min)/(max-min))*(H-pad*2);
    svg += `<line x1="${pad}" x2="${W-pad}" y1="${y}" y2="${y}" stroke="#C5DADB"/><text x="2" y="${y+4}" font-size="11" fill="#5B7C84">${t}</text>`;
  });
  data.forEach((v,i) => {
    const h = ((v-min)/(max-min))*(H-pad*2);
    const x = pad + i*step + (step-bw)/2, y = H - pad - h;
    svg += `<rect x="${x}" y="${y}" width="${bw}" height="${h}" fill="${v<92?'#F2A93B':'#0E3B43'}"/>`;
    svg += `<text x="${x+bw/2}" y="${y-5}" font-size="12" text-anchor="middle" fill="#12232B">${v}</text>`;
    svg += `<text x="${x+bw/2}" y="${H-8}" font-size="12" text-anchor="middle" fill="#5B7C84">${days[i]}</text>`;
  });
  document.getElementById("chart").innerHTML = svg + "</svg>";
}

function setFilter(f){
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c.dataset.f === f));
  renderKpis(f); renderChart(f);
}
document.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => setFilter(c.dataset.f)));
setFilter("all");

// Track order (interactive business feature)
const orders = {
  TRK1025:{cargo:"Vaccines", status:"In Transit", cls:"ok", loc:"Bharuch, NH48", temp:"4.1 °C", eta:"Today, 6:30 PM", driver:"Ramesh P., +91 00000 00001"},
  TRK1026:{cargo:"Ice cream", status:"Delayed", cls:"warn", loc:"Surat toll plaza", temp:"-19.5 °C", eta:"Today, 9:15 PM", driver:"Imran S., +91 00000 00002"},
  TRK1027:{cargo:"Frozen prawns", status:"Temperature alert", cls:"bad", loc:"Valsad", temp:"-12.0 °C (limit -18 °C)", eta:"Today, 7:45 PM", driver:"Kiran D., +91 00000 00003"},
  TRK1028:{cargo:"Milk", status:"Delivered", cls:"ok", loc:"Mumbai, Andheri hub", temp:"5.3 °C", eta:"Delivered 11:20 AM", driver:"Vijay M., +91 00000 00004"}
};
document.getElementById("trackForm").addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("oid").value.trim().toUpperCase();
  const r = document.getElementById("result"), o = orders[id];
  if(!o){ r.className = "result"; r.textContent = `No order found for "${id}". Check the ID and try again, for example TRK1025.`; return; }
  r.className = "result found";
  r.innerHTML = `<h3>${id}: ${o.cargo}</h3>
    <p><span class="badge ${o.cls}">${o.status}</span></p>
    <p><b>Current location:</b> ${o.loc}<br><b>Cargo temperature:</b> ${o.temp}<br><b>Expected delivery:</b> ${o.eta}<br><b>Driver:</b> ${o.driver}</p>`;
});

// Cost calculator
document.getElementById("calcForm").addEventListener("submit", e => {
  e.preventDefault();
  const rate = +document.getElementById("svc").value, km = +document.getElementById("km").value;
  document.getElementById("est").textContent = `Estimated cost: ₹${(rate*km).toLocaleString("en-IN")} for ${km} km.`;
});

// Enquiry form
document.getElementById("enqForm").addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("enqMsg").textContent = `Thanks, ${document.getElementById("n").value}. We will reply to ${document.getElementById("e").value} within one working day.`;
  e.target.reset();
});
