<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ulloa Construction — Lead CRM</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --blue: #1a4fa0; --blue-dark: #0f3070; --blue-light: #e8f0fc;
      --gold: #c9a84c; --green: #16a34a; --red: #dc2626; --yellow: #d97706;
      --gray-50: #f9fafb; --gray-100: #f3f4f6; --gray-200: #e5e7eb;
      --gray-400: #9ca3af; --gray-600: #4b5563; --gray-800: #1f2937;
      --radius: 8px; --shadow: 0 1px 3px rgba(0,0,0,.1);
    }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--gray-50); color: var(--gray-800); min-height: 100vh; }
    header { background: var(--blue-dark); color: white; padding: 0 24px; height: 60px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 8px rgba(0,0,0,.3); }
    header h1 { font-size: 18px; font-weight: 700; }
    header h1 span { color: var(--gold); }
    header .right { display: flex; align-items: center; gap: 12px; }
    header .cslb { font-size: 12px; color: rgba(255,255,255,.6); }
    .container { max-width: 1280px; margin: 0 auto; padding: 24px 16px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { background: white; border-radius: var(--radius); padding: 16px 20px; box-shadow: var(--shadow); border-left: 4px solid var(--blue); }
    .stat-card.green { border-color: var(--green); }
    .stat-card.yellow { border-color: var(--yellow); }
    .stat-card.red { border-color: var(--red); }
    .stat-label { font-size: 11px; color: var(--gray-600); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px; }
    .stat-value { font-size: 26px; font-weight: 700; }
    .toolbar { display: flex; gap: 10px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
    .filter-tabs { display: flex; gap: 6px; }
    .tab { padding: 7px 14px; border-radius: 20px; border: 1px solid var(--gray-200); background: white; font-size: 13px; cursor: pointer; color: var(--gray-600); transition: all .15s; }
    .tab:hover { border-color: var(--blue); color: var(--blue); }
    .tab.active { background: var(--blue); color: white; border-color: var(--blue); }
    .spacer { flex: 1; }
    .btn { padding: 8px 14px; border-radius: var(--radius); font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: opacity .15s; }
    .btn:hover { opacity: .85; }
    .btn-primary { background: var(--blue); color: white; }
    .btn-sm { padding: 5px 10px; font-size: 12px; }
    .btn-ghost { background: transparent; border: 1px solid var(--gray-200); color: var(--gray-600); }
    .btn-danger { background: var(--red); color: white; }
    .btn-success { background: var(--green); color: white; }
    .btn-gold { background: var(--gold); color: white; }
    .table-wrap { background: white; border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: var(--gray-50); border-bottom: 2px solid var(--gray-200); }
    th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--gray-600); }
    td { padding: 12px 14px; font-size: 14px; border-bottom: 1px solid var(--gray-100); vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: var(--blue-light); }
    .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
    .badge-active { background: #dcfce7; color: #15803d; }
    .badge-completed { background: #dbeafe; color: #1d4ed8; }
    .badge-unqualified { background: var(--gray-100); color: var(--gray-600); }
    .badge-takeover { background: #fef3c7; color: #92400e; }
    .progress { display: flex; gap: 4px; }
    .dot { width: 22px; height: 22px; border-radius: 50%; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; color: white; }
    .dot-sent { background: var(--blue); }
    .dot-pending { background: var(--gray-200); color: var(--gray-400); }
    .actions { display: flex; gap: 5px; flex-wrap: wrap; }
    .empty { text-align: center; padding: 60px 20px; color: var(--gray-400); }
    /* Overlay & Modal */
    .overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 100; align-items: center; justify-content: center; padding: 16px; }
    .overlay.open { display: flex; }
    .modal { background: white; border-radius: 12px; width: 100%; max-width: 540px; box-shadow: 0 20px 60px rgba(0,0,0,.3); max-height: 90vh; overflow-y: auto; }
    .modal-header { padding: 20px 24px; border-bottom: 1px solid var(--gray-200); display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: white; z-index: 1; }
    .modal-header h2 { font-size: 17px; font-weight: 700; }
    .modal-close { background: none; border: none; font-size: 22px; cursor: pointer; color: var(--gray-400); }
    .modal-body { padding: 24px; }
    .modal-footer { padding: 16px 24px; border-top: 1px solid var(--gray-200); display: flex; justify-content: flex-end; gap: 10px; }
    .form-group { margin-bottom: 16px; }
    label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; }
    input, select, textarea { width: 100%; padding: 9px 12px; border: 1px solid var(--gray-200); border-radius: var(--radius); font-size: 14px; outline: none; transition: border-color .15s; font-family: inherit; }
    input:focus, select:focus, textarea:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(26,79,160,.1); }
    textarea { resize: vertical; min-height: 80px; }
    /* Detail panel */
    .detail-overlay { display: none; position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,.5); justify-content: flex-end; }
    .detail-overlay.open { display: flex; }
    .detail-panel { background: white; width: 440px; height: 100vh; overflow-y: auto; box-shadow: -4px 0 24px rgba(0,0,0,.2); display: flex; flex-direction: column; }
    .detail-panel-header { padding: 20px; background: var(--blue-dark); color: white; position: sticky; top: 0; z-index: 1; }
    .detail-panel-header h3 { font-size: 17px; font-weight: 700; }
    .detail-panel-header p { font-size: 12px; opacity: .7; margin-top: 2px; }
    .detail-section { padding: 18px 20px; border-bottom: 1px solid var(--gray-100); }
    .detail-section h4 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: var(--gray-400); margin-bottom: 10px; }
    .detail-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
    .detail-row .label { color: var(--gray-600); }
    .msg-item { background: var(--gray-50); border-radius: 6px; padding: 10px 12px; margin-bottom: 8px; font-size: 13px; }
    .msg-item .meta { font-size: 11px; color: var(--gray-400); margin-bottom: 4px; }
    .notes-area { width: 100%; padding: 10px; border: 1px solid var(--gray-200); border-radius: var(--radius); font-size: 14px; font-family: inherit; resize: vertical; min-height: 100px; outline: none; }
    .notes-area:focus { border-color: var(--blue); }
    .loading { text-align: center; padding: 40px; color: var(--gray-400); font-size: 14px; }
    /* AI Settings panel */
    .settings-panel { background: #f8faff; border: 1px solid #c7d8f5; border-radius: var(--radius); padding: 16px; margin-bottom: 16px; }
    .settings-panel h3 { font-size: 14px; font-weight: 700; color: var(--blue-dark); margin-bottom: 12px; }
    #toast { position: fixed; bottom: 24px; right: 24px; background: var(--gray-800); color: white; padding: 12px 20px; border-radius: var(--radius); font-size: 14px; display: none; z-index: 999; box-shadow: 0 4px 16px rgba(0,0,0,.3); }
    #toast.show { display: block; animation: fadein .2s; }
    @keyframes fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    .hint { font-size: 12px; color: var(--gray-400); margin-top: 4px; }
  </style>
</head>
<body>

<header>
  <h1>Ulloa <span>Construction</span> — Lead CRM</h1>
  <div class="right">
    <button class="btn btn-gold btn-sm" onclick="openAISettings()">⚙ AI Settings</button>
    <span class="cslb">CSLB #1144906</span>
  </div>
</header>

<div class="container">
  <div class="stats" id="stats">
    <div class="stat-card"><div class="stat-label">Total Leads</div><div class="stat-value" id="s-total">—</div></div>
    <div class="stat-card green"><div class="stat-label">Active</div><div class="stat-value" id="s-active">—</div></div>
    <div class="stat-card yellow"><div class="stat-label">Owner Takeover</div><div class="stat-value" id="s-takeover">—</div></div>
    <div class="stat-card"><div class="stat-label">Completed</div><div class="stat-value" id="s-completed">—</div></div>
    <div class="stat-card red"><div class="stat-label">Unqualified</div><div class="stat-value" id="s-unqualified">—</div></div>
  </div>

  <div class="toolbar">
    <div class="filter-tabs">
      <button class="tab active" onclick="setFilter('', event)">All</button>
      <button class="tab" onclick="setFilter('active', event)">Active</button>
      <button class="tab" onclick="setFilter('completed', event)">Completed</button>
      <button class="tab" onclick="setFilter('unqualified', event)">Unqualified</button>
    </div>
    <div class="spacer"></div>
    <button class="btn btn-ghost btn-sm" onclick="loadLeads()">↻ Refresh</button>
    <button class="btn btn-primary" onclick="openAddModal()">+ Add Lead</button>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Contact</th>
          <th>Service</th>
          <th>Status</th>
          <th>Progress</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="leads-table">
        <tr><td colspan="7" class="loading">Loading leads...</td></tr>
      </tbody>
    </table>
  </div>
</div>

<!-- Add Lead Modal -->
<div class="overlay" id="add-modal">
  <div class="modal">
    <div class="modal-header">
      <h2>Add Lead Manually</h2>
      <button class="modal-close" onclick="closeAddModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="form-group"><label>Full Name *</label><input type="text" id="f-name" placeholder="Maria Garcia" /></div>
      <div class="form-group"><label>Phone</label><input type="tel" id="f-phone" placeholder="(714) 555-0000" /></div>
      <div class="form-group"><label>Email</label><input type="email" id="f-email" placeholder="maria@example.com" /></div>
      <div class="form-group">
        <label>Service Type</label>
        <select id="f-service">
          <option value="">— Select —</option>
          <option>Kitchen Remodel</option>
          <option>Bathroom Renovation</option>
          <option>Room Addition</option>
          <option>ADU</option>
          <option>Other</option>
        </select>
      </div>
      <div class="form-group"><label>Notes / Message</label><textarea id="f-message" placeholder="What did they say or ask for?"></textarea></div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeAddModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitLead()">Add Lead</button>
    </div>
  </div>
</div>

<!-- AI Settings Modal -->
<div class="overlay" id="ai-modal">
  <div class="modal">
    <div class="modal-header">
      <h2>⚙ AI Message Settings</h2>
      <button class="modal-close" onclick="closeAISettings()">×</button>
    </div>
    <div class="modal-body">
      <div class="settings-panel">
        <h3>These settings control how Claude writes your nurture messages</h3>
        <p style="font-size:13px;color:var(--gray-600);">Changes apply to all future messages. Already-sent messages are not affected.</p>
      </div>
      <div class="form-group">
        <label>Tone</label>
        <select id="ai-tone">
          <option value="warm and conversational">Warm and conversational (default)</option>
          <option value="professional and formal">Professional and formal</option>
          <option value="casual and friendly">Casual and friendly</option>
          <option value="direct and concise">Direct and concise</option>
          <option value="enthusiastic and energetic">Enthusiastic and energetic</option>
        </select>
        <p class="hint">Controls the overall vibe of every SMS and email.</p>
      </div>
      <div class="form-group">
        <label>SMS Sign-off Name</label>
        <input type="text" id="ai-signature" placeholder="David @ Ulloa Construction" />
        <p class="hint">How you sign every text message. Keep it short.</p>
      </div>
      <div class="form-group">
        <label>Extra Instructions for Claude</label>
        <textarea id="ai-context" rows="5" placeholder="e.g. Always mention our free estimate offer. Focus heavily on ADU financing options. Never mention competitors. Always reference our 20+ years of experience."></textarea>
        <p class="hint">Anything specific you want Claude to keep in mind when writing messages. Be as specific as you want.</p>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeAISettings()">Cancel</button>
      <button class="btn btn-primary" onclick="saveAISettings()">Save Settings</button>
    </div>
  </div>
</div>

<!-- Lead Detail Panel -->
<div class="detail-overlay" id="detail-overlay" onclick="closeDetail(event)">
  <div class="detail-panel" id="detail-panel">
    <div class="detail-panel-header">
      <button onclick="closeDetailPanel()" style="background:none;border:none;color:white;font-size:18px;cursor:pointer;margin-bottom:6px;">← Back</button>
      <h3 id="dp-name">Lead Details</h3>
      <p id="dp-sub"></p>
    </div>
    <div id="dp-content"><div class="loading">Loading...</div></div>
  </div>
</div>

<div id="toast"></div>

<script>
  const DAYS = [1, 3, 7, 14];
  let currentFilter = '';
  let currentDetailId = null;

  // ── Load leads ────────────────────────────────────────────

  async function loadLeads() {
    const url = currentFilter ? `/api/leads?status=${currentFilter}&limit=100` : '/api/leads?limit=100';
    try {
      const res  = await fetch(url);
      const data = await res.json();
      renderTable(data.leads || []);
      updateStats(data.leads || []);
    } catch {
      document.getElementById('leads-table').innerHTML =
        `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--red);">Failed to load leads</td></tr>`;
    }
  }

  function updateStats(leads) {
    document.getElementById('s-total').textContent     = leads.length;
    document.getElementById('s-active').textContent    = leads.filter(l => l.status === 'active').length;
    document.getElementById('s-takeover').textContent  = leads.filter(l => l.owner_takeover).length;
    document.getElementById('s-completed').textContent = leads.filter(l => l.status === 'completed').length;
    document.getElementById('s-unqualified').textContent = leads.filter(l => l.status === 'unqualified').length;
  }

  function renderTable(leads) {
    const tbody = document.getElementById('leads-table');
    if (!leads.length) {
      tbody.innerHTML = `<tr><td colspan="7"><div class="empty"><p>No leads found.</p></div></td></tr>`;
      return;
    }
    tbody.innerHTML = leads.map(lead => {
      const contact  = lead.email || lead.phone || '—';
      const progress = renderProgress(lead.nurture_log || []);
      const hasNotes = lead.notes ? '📝' : '';
      const takeoverBtn = lead.owner_takeover
        ? `<button class="btn btn-success btn-sm" onclick="toggleTakeover('${lead.id}', false)">▶ Resume</button>`
        : `<button class="btn btn-ghost btn-sm" onclick="toggleTakeover('${lead.id}', true)">⏸ Pause</button>`;
      return `
        <tr>
          <td><strong style="cursor:pointer;color:var(--blue);" onclick="openDetail('${lead.id}')">${escHtml(lead.name)}</strong><br><small style="color:var(--gray-400);">${timeSince(lead.created_at)}</small></td>
          <td style="font-size:13px;">${escHtml(contact)}</td>
          <td style="font-size:13px;">${escHtml(lead.service_type || '—')}</td>
          <td>${statusLabel(lead)}</td>
          <td>${progress}</td>
          <td style="font-size:16px;">${hasNotes}</td>
          <td>
            <div class="actions">
              ${takeoverBtn}
              <button class="btn btn-gold btn-sm" onclick="openDetail('${lead.id}')">Notes</button>
              <select class="btn btn-ghost btn-sm" onchange="changeStatus('${lead.id}', this.value)" style="cursor:pointer;">
                <option value="">Status...</option>
                <option value="active" ${lead.status==='active'?'selected':''}>Active</option>
                <option value="completed" ${lead.status==='completed'?'selected':''}>Completed</option>
                <option value="unqualified" ${lead.status==='unqualified'?'selected':''}>Unqualified</option>
              </select>
              <button class="btn btn-danger btn-sm" onclick="deleteLead('${lead.id}', '${escHtml(lead.name)}')">Delete</button>
            </div>
          </td>
        </tr>`;
    }).join('');
  }

  function renderProgress(logs) {
    return `<div class="progress">${DAYS.map(day => {
      const sent = logs.some(l => l.day_number === day && l.status === 'sent');
      return `<div class="dot ${sent ? 'dot-sent' : 'dot-pending'}" title="Day ${day}">${day}</div>`;
    }).join('')}</div>`;
  }

  function statusLabel(lead) {
    if (lead.owner_takeover) return `<span class="badge badge-takeover">⚡ Takeover</span>`;
    const map = { active: 'badge-active', completed: 'badge-completed', unqualified: 'badge-unqualified' };
    return `<span class="badge ${map[lead.status] || ''}">${lead.status}</span>`;
  }

  // ── Filters ───────────────────────────────────────────────

  function setFilter(f, e) {
    currentFilter = f;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    loadLeads();
  }

  // ── Add lead ──────────────────────────────────────────────

  function openAddModal()  { document.getElementById('add-modal').classList.add('open'); }
  function closeAddModal() { document.getElementById('add-modal').classList.remove('open'); }

  async function submitLead() {
    const name  = document.getElementById('f-name').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const email = document.getElementById('f-email').value.trim();
    if (!name || (!phone && !email)) return showToast('Name and at least one contact method are required.');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone: phone||null, email: email||null,
          service_type: document.getElementById('f-service').value||null,
          message: document.getElementById('f-message').value.trim()||null })
      });
      if (!res.ok) throw new Error();
      closeAddModal();
      showToast('Lead added.');
      loadLeads();
      ['f-name','f-phone','f-email','f-message'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('f-service').value = '';
    } catch { showToast('Error adding lead.'); }
  }

  // ── Lead actions ──────────────────────────────────────────

  async function toggleTakeover(id, value) {
    await fetch(`/api/leads/${id}/takeover`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner_takeover: value })
    });
    showToast(value ? 'Automation paused.' : 'Automation resumed.');
    loadLeads();
  }

  async function changeStatus(id, status) {
    if (!status) return;
    await fetch(`/api/leads/${id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    showToast(`Status updated to "${status}".`);
    loadLeads();
  }

  async function deleteLead(id, name) {
    if (!confirm(`Delete ${name} permanently? This cannot be undone.`)) return;
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    showToast('Lead deleted.');
    loadLeads();
  }

  // ── Notes ─────────────────────────────────────────────────

  async function saveNotes(id) {
    const notes = document.getElementById('notes-input').value;
    await fetch(`/api/leads/${id}/notes`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });
    showToast('Notes saved.');
    loadLeads();
  }

  // ── Detail panel ──────────────────────────────────────────

  async function openDetail(id) {
    currentDetailId = id;
    document.getElementById('detail-overlay').classList.add('open');
    document.getElementById('dp-content').innerHTML = '<div class="loading">Loading...</div>';
    const res  = await fetch(`/api/leads/${id}`);
    const lead = await res.json();
    document.getElementById('dp-name').textContent = lead.name;
    document.getElementById('dp-sub').textContent  = `${lead.service_type || 'General Inquiry'} • ${lead.source}`;
    const logs    = lead.nurture_log      || [];
    const inbound = lead.inbound_messages || [];
    document.getElementById('dp-content').innerHTML = `
      <div class="detail-section">
        <h4>Contact Info</h4>
        <div class="detail-row"><span class="label">Phone</span><span>${lead.phone || '—'}</span></div>
        <div class="detail-row"><span class="label">Email</span><span>${lead.email || '—'}</span></div>
        <div class="detail-row"><span class="label">Status</span><span>${lead.status}</span></div>
        <div class="detail-row"><span class="label">Created</span><span>${new Date(lead.created_at).toLocaleDateString()}</span></div>
      </div>
      <div class="detail-section">
        <h4>Original Message</h4>
        <p style="font-size:14px;color:var(--gray-600);">${lead.message || 'No message provided.'}</p>
      </div>
      <div class="detail-section">
        <h4>Notes (internal — not sent to lead)</h4>
        <textarea id="notes-input" class="notes-area" placeholder="Add notes about this lead — job scope, budget discussed, follow-up date, anything...">${lead.notes || ''}</textarea>
        <button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="saveNotes('${lead.id}')">Save Notes</button>
        <p class="hint" style="margin-top:6px;">Claude uses these notes to personalize future messages.</p>
      </div>
      <div class="detail-section">
        <h4>Nurture Messages Sent (${logs.length})</h4>
        ${logs.length ? logs.map(l => `
          <div class="msg-item">
            <div class="meta">Day ${l.day_number} • ${l.channel.toUpperCase()} • ${new Date(l.sent_at).toLocaleString()} • <strong style="color:${l.status==='sent'?'var(--green)':'var(--red)'}">${l.status}</strong></div>
            <div>${escHtml((l.content||'').substring(0,200))}${(l.content||'').length>200?'…':''}</div>
          </div>`).join('') : '<p style="font-size:13px;color:var(--gray-400);">No messages sent yet.</p>'}
      </div>
      ${inbound.length ? `
      <div class="detail-section">
        <h4>Lead Replies (${inbound.length})</h4>
        ${inbound.map(m => `
          <div class="msg-item" style="border-left:3px solid var(--gold);">
            <div class="meta">${new Date(m.received_at).toLocaleString()}</div>
            <div>${escHtml(m.body)}</div>
          </div>`).join('')}
      </div>` : ''}
    `;
  }

  function closeDetail(e) {
    if (e.target === document.getElementById('detail-overlay')) closeDetailPanel();
  }
  function closeDetailPanel() {
    document.getElementById('detail-overlay').classList.remove('open');
  }

  // ── AI Settings ───────────────────────────────────────────

  async function openAISettings() {
    document.getElementById('ai-modal').classList.add('open');
    try {
      const res  = await fetch('/api/leads/settings/ai');
      const data = await res.json();
      document.getElementById('ai-tone').value      = data.tone || 'warm and conversational';
      document.getElementById('ai-signature').value = data.sms_signature || '';
      document.getElementById('ai-context').value   = data.extra_context || '';
    } catch { /* use defaults */ }
  }

  function closeAISettings() { document.getElementById('ai-modal').classList.remove('open'); }

  async function saveAISettings() {
    try {
      await fetch('/api/leads/settings/ai', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tone:          document.getElementById('ai-tone').value,
          sms_signature: document.getElementById('ai-signature').value,
          extra_context: document.getElementById('ai-context').value,
        })
      });
      closeAISettings();
      showToast('AI settings saved. New messages will use these settings.');
    } catch { showToast('Error saving settings.'); }
  }

  // ── Helpers ───────────────────────────────────────────────

  function timeSince(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 36e5);
    if (h < 1)  return 'just now';
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h/24)}d ago`;
  }

  function escHtml(str) {
    return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  let toastTimer;
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
  }

  loadLeads();
  setInterval(loadLeads, 60000);
</script>
</body>
</html>