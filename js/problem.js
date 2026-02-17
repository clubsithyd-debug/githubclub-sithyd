/* ===============================
   PROBLEM STATEMENTS JS
   SymbiHackathon 2026
   =============================== */

// ── Sample data (used when CSV URL not provided) ──────────────────
const SAMPLE_DATA = [
    { sno:1,  id:'SH26-001', title:'Smart Campus Energy Monitor',        domain:'IoT & Embedded',     description:'Design a real-time energy monitoring system for college campuses using IoT sensors. The system should track consumption per floor/lab, generate alerts for anomalies, and provide a dashboard for facility managers to reduce wastage by at least 20%.' },
    { sno:2,  id:'SH26-002', title:'AI-Based Attendance System',          domain:'AI / ML',             description:'Build a contactless, AI-powered attendance system using facial recognition that works in varying lighting conditions. Should handle 500+ students per session, integrate with existing ERPs, and flag proxy attempts in real time.' },
    { sno:3,  id:'SH26-003', title:'Open Source Contribution Tracker',    domain:'Developer Tools',    description:'Create a GitHub-integrated dashboard that gamifies open source contributions for students. Track PRs, issues, code reviews, and streak data. Include leaderboards, badges, and club-level analytics.' },
    { sno:4,  id:'SH26-004', title:'Mental Health Peer Support Bot',      domain:'HealthTech',         description:'Develop an anonymous, AI-driven peer support chatbot for students experiencing stress or burnout. Should detect crisis signals and escalate to human counsellors while maintaining strict data privacy compliance.' },
    { sno:5,  id:'SH26-005', title:'Decentralised Voting Platform',       domain:'Blockchain',         description:'Build a tamper-proof digital voting platform using blockchain for college elections. Must support anonymous voting, real-time result tallying, audit trails, and be accessible on low-bandwidth mobile connections.' },
    { sno:6,  id:'SH26-006', title:'Hyperlocal Food Waste Reducer',       domain:'Sustainability',     description:'Create a platform connecting college canteens with NGOs and hostels to redistribute surplus food in real time. Include predictive demand forecasting to reduce over-preparation and generate monthly impact reports.' },
    { sno:7,  id:'SH26-007', title:'AR-Based Lab Safety Trainer',         domain:'AR / VR',            description:'Design an augmented reality module that trains students on lab safety protocols before they enter physical labs. Include interactive hazard simulations, quiz checkpoints, and compliance certificates on completion.' },
    { sno:8,  id:'SH26-008', title:'Accessible Learning Platform',        domain:'EdTech',             description:'Build a learning management system specifically designed for students with visual, auditory, or motor disabilities. Must meet WCAG 2.1 AA standards, support screen readers, and provide AI-generated alt-text for all content.' },
    { sno:9,  id:'SH26-009', title:'Campus Lost & Found Network',         domain:'Community Tech',     description:'Develop a geo-tagged lost and found platform for campus items with image recognition to match lost and found posts automatically. Include push notifications and a trust-based claim verification system.' },
    { sno:10, id:'SH26-010', title:'Real-Time Plagiarism Shield',          domain:'Developer Tools',    description:'Create a plagiarism detection engine that compares submissions against the internet, past submissions, and peer work in real time. Should support code, reports, and presentations with an explainability layer for faculty.' },
    { sno:11, id:'SH26-011', title:'Student Startup Matchmaking Engine',   domain:'AI / ML',            description:'Build an AI matchmaking system that connects student founders with co-founders, mentors, and investors based on skills, interests, and idea stage. Include a pitch deck builder and milestone tracker.' },
    { sno:12, id:'SH26-012', title:'Smart Waste Segregation Bin',          domain:'IoT & Embedded',     description:'Design a smart bin with computer vision that auto-segregates waste into dry, wet, and e-waste categories. Log data to a cloud dashboard showing fill levels, segregation accuracy, and collection schedules.' },
    { sno:13, id:'SH26-013', title:'Peer-to-Peer Skill Exchange',          domain:'Community Tech',     description:'Create a time-banking platform where students trade skills — e.g. web dev for guitar lessons. Include scheduling, session logging, rating systems, and a credit economy managed by the institution.' },
    { sno:14, id:'SH26-014', title:'Supply Chain Transparency Tool',       domain:'Blockchain',         description:'Build a blockchain-backed tool for tracking the provenance of lab consumables and equipment purchases. Provide immutable audit logs, vendor rating systems, and automated red-flag alerts for procurement anomalies.' },
    { sno:15, id:'SH26-015', title:'Carbon Footprint Calculator — Campus', domain:'Sustainability',     description:'Develop a tool that calculates the carbon footprint of a college campus by aggregating data from transport, electricity, water, and waste sources. Generate personalised reduction recommendations and a public transparency dashboard.' },
];

// ── State ─────────────────────────────────────────────────────────
let allData     = [];
let filtered    = [];
let currentPage = 1;
let rowsPerPage = 10;
let sortCol     = '';
let sortDir     = 'asc';
let modalRow    = null;

// ── DOM refs ──────────────────────────────────────────────────────
const tbody        = document.getElementById('ps-tbody');
const searchInput  = document.getElementById('search-input');
const sortSelect   = document.getElementById('sort-select');
const domainFilter = document.getElementById('domain-filter');
const rowsSelect   = document.getElementById('rows-select');
const statsText    = document.getElementById('stats-text');
const pageInfo     = document.getElementById('page-info');
const pagination   = document.getElementById('pagination');
const csvStatus    = document.getElementById('csv-status');
const csvStatusTxt = document.getElementById('csv-status-text');
const csvError     = document.getElementById('csv-error');
const csvErrorText = document.getElementById('csv-error-text');
const downloadBtn  = document.getElementById('download-btn');

// Modal
const descModal     = document.getElementById('desc-modal');
const modalId       = document.getElementById('modal-id');
const modalTitle    = document.getElementById('modal-title');
const modalDomain   = document.getElementById('modal-domain');
const modalDesc     = document.getElementById('modal-desc');
const modalDownload = document.getElementById('modal-download');
const modalClose    = document.getElementById('modal-close');
const modalClose2   = document.getElementById('modal-close2');

// ── CSV Parser ────────────────────────────────────────────────────
function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row.');

    // Parse header — normalise to lowercase, trim
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));

    // Map flexible column names
    const col = name => {
        const aliases = {
            sno:         ['sno','s.no','s no','serial','serial no','serial number','#'],
            id:          ['id','statement id','problem id','ps id','psid','statement_id'],
            title:       ['title','problem title','name','problem name','statement title'],
            domain:      ['domain','track','category','domain/track'],
            description: ['description','desc','details','problem description','problem statement'],
        };
        for (const [key, list] of Object.entries(aliases)) {
            if (list.includes(name)) return key;
        }
        return null;
    };

    const colMap = {};
    headers.forEach((h, i) => { const k = col(h); if (k) colMap[k] = i; });

    const required = ['title'];
    for (const r of required) {
        if (colMap[r] === undefined) throw new Error(`Missing required column: "${r}". Found: ${headers.join(', ')}`);
    }

    // Parse rows — handle quoted fields
    const parseRow = line => {
        const fields = [];
        let cur = '', inQuote = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') { inQuote = !inQuote; }
            else if (ch === ',' && !inQuote) { fields.push(cur.trim()); cur = ''; }
            else { cur += ch; }
        }
        fields.push(cur.trim());
        return fields;
    };

    return lines.slice(1).filter(l => l.trim()).map((line, idx) => {
        const f = parseRow(line);
        const get = key => colMap[key] !== undefined ? (f[colMap[key]] || '').replace(/^"|"$/g, '').trim() : '';
        return {
            sno:         colMap.sno !== undefined ? parseInt(get('sno')) || (idx + 1) : idx + 1,
            id:          get('id')          || `PS-${String(idx + 1).padStart(3,'0')}`,
            title:       get('title'),
            domain:      get('domain')      || 'General',
            description: get('description') || '—',
        };
    });
}

// ── CSV Path — change this to update the source ───────────────────
//const CSV_PATH = './assets/data/problems.csv';

async function autoLoadCSV() {
    try {
        const res = await fetch(CSV_PATH);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const data = parseCSV(text);
        if (data.length === 0) throw new Error('CSV has no data rows.');

        loadData(data);
        csvStatus.className = 'csv-status-bar loaded mb-6';
        csvStatusTxt.innerHTML = `<i class="fa-solid fa-circle-check mr-2"></i>Loaded ${data.length} problem statements.`;

    } catch (e) {
        csvStatus.className = 'csv-status-bar error mb-6';
        csvStatusTxt.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-2"></i>Could not load <code style="color:var(--ghgreen)">${CSV_PATH}</code> — ${e.message}`;
    }
}

// ── Load data into table ──────────────────────────────────────────
function loadData(data) {
    allData = data;
    currentPage = 1;
    sortCol = '';
    sortDir = 'asc';
    sortSelect.value = '';
    searchInput.value = '';

    // Populate domain filter
    const domains = [...new Set(data.map(r => r.domain))].sort();
    domainFilter.innerHTML = '<option value="">All Domains</option>';
    domains.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d; opt.textContent = d;
        domainFilter.appendChild(opt);
    });

    applyFilters();
}

// ── Filter + Sort + Render ────────────────────────────────────────
function applyFilters() {
    const q      = searchInput.value.trim().toLowerCase();
    const domain = domainFilter.value;

    filtered = allData.filter(row => {
        const matchDomain = !domain || row.domain === domain;
        const matchQ = !q || [row.title, row.id, row.domain, row.description, String(row.sno)]
            .some(v => v.toLowerCase().includes(q));
        return matchDomain && matchQ;
    });

    applySort();
}

function applySort() {
    const val = sortSelect.value;
    if (val) {
        const [col, dir] = val === 'sno-desc' ? ['sno','desc'] : [val,'asc'];
        filtered.sort((a, b) => {
            let av = a[col] ?? '', bv = b[col] ?? '';
            if (typeof av === 'number') return dir === 'asc' ? av - bv : bv - av;
            return dir === 'asc'
                ? String(av).localeCompare(String(bv))
                : String(bv).localeCompare(String(av));
        });
    }

    currentPage = 1;
    renderTable();
}

function renderTable() {
    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="6">
            <div class="empty-state">
                <i class="fa-solid fa-magnifying-glass"></i>
                <p>No problem statements match your search.</p>
            </div></td></tr>`;
        statsText.textContent = '0 results';
        pageInfo.textContent  = '';
        pagination.innerHTML  = '';
        return;
    }

    const rpp    = rowsPerPage === 'all' ? filtered.length : rowsPerPage;
    const total  = filtered.length;
    const pages  = rowsPerPage === 'all' ? 1 : Math.ceil(total / rpp);
    currentPage  = Math.min(currentPage, pages);
    const start  = (currentPage - 1) * rpp;
    const end    = Math.min(start + rpp, total);
    const pageRows = filtered.slice(start, end);

    pageRows.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="col-sno">${row.sno}</td>
            <td class="col-id">${escHtml(row.id)}</td>
            <td class="col-title">${escHtml(row.title)}</td>
            <td class="col-domain"><span class="domain-badge">${escHtml(row.domain)}</span></td>
            <td class="col-desc">
                <div class="desc-preview">${escHtml(row.description)}</div>
                <button class="desc-read-more" data-id="${escHtml(row.id)}">read more →</button>
            </td>
            <td class="col-dl" style="text-align:center">
                <button class="dl-btn interactive" title="Download ${escHtml(row.id)}" data-id="${escHtml(row.id)}">
                    <i class="fa-solid fa-download"></i>
                </button>
            </td>
        `;

        // Read more
        tr.querySelector('.desc-read-more').addEventListener('click', () => openModal(row));
        // Row download
        tr.querySelector('.dl-btn').addEventListener('click', () => downloadRow(row));

        tbody.appendChild(tr);
    });

    // Stats
    statsText.textContent = `Showing ${start + 1}–${end} of ${total} problem statement${total !== 1 ? 's' : ''}`;
    pageInfo.textContent  = rowsPerPage !== 'all' ? `Page ${currentPage} of ${pages}` : '';

    renderPagination(pages);
}

// ── Pagination ────────────────────────────────────────────────────
function renderPagination(pages) {
    pagination.innerHTML = '';
    if (pages <= 1) return;

    const btn = (label, page, disabled = false, active = false) => {
        const b = document.createElement('button');
        b.className = 'page-btn' + (active ? ' active' : '');
        b.innerHTML = label;
        b.disabled  = disabled;
        b.addEventListener('click', () => { currentPage = page; renderTable(); });
        return b;
    };

    pagination.appendChild(btn('&laquo;', 1, currentPage === 1));
    pagination.appendChild(btn('&lsaquo;', currentPage - 1, currentPage === 1));

    // Page numbers with ellipsis
    const range = [];
    for (let i = 1; i <= pages; i++) {
        if (i === 1 || i === pages || (i >= currentPage - 2 && i <= currentPage + 2)) range.push(i);
        else if (range[range.length - 1] !== '...') range.push('...');
    }

    range.forEach(p => {
        if (p === '...') {
            const span = document.createElement('span');
            span.className = 'page-ellipsis';
            span.textContent = '···';
            pagination.appendChild(span);
        } else {
            pagination.appendChild(btn(p, p, false, p === currentPage));
        }
    });

    pagination.appendChild(btn('&rsaquo;', currentPage + 1, currentPage === pages));
    pagination.appendChild(btn('&raquo;', pages, currentPage === pages));
}

// ── Modal ─────────────────────────────────────────────────────────
function openModal(row) {
    modalRow = row;
    modalId.textContent     = row.id;
    modalTitle.textContent  = row.title;
    modalDomain.textContent = row.domain;
    modalDesc.textContent   = row.description;
    descModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    descModal.classList.add('hidden');
    document.body.style.overflow = '';
    modalRow = null;
}

modalClose.addEventListener('click', closeModal);
modalClose2.addEventListener('click', closeModal);
descModal.addEventListener('click', e => { if (e.target === descModal) closeModal(); });
modalDownload.addEventListener('click', () => { if (modalRow) downloadRow(modalRow); });

// ── Download helpers ──────────────────────────────────────────────
function downloadRow(row) {
    const content = [
        `SymbiHackathon 2026 — Problem Statement`,
        `${'='.repeat(50)}`,
        `S.No:        ${row.sno}`,
        `Statement ID: ${row.id}`,
        `Title:        ${row.title}`,
        `Domain/Track: ${row.domain}`,
        ``,
        `Description:`,
        row.description,
        ``,
        `${'='.repeat(50)}`,
        `GitHub Club · SIT Hyderabad`,
    ].join('\n');

    triggerDownload(content, `${row.id}.txt`, 'text/plain');
}

function downloadFilteredCSV() {
    if (filtered.length === 0) return;
    const header = 'S.No,Statement ID,Title,Domain/Track,Description';
    const rows = filtered.map(r =>
        [r.sno, `"${r.id}"`, `"${r.title.replace(/"/g,'""')}"`,
         `"${r.domain.replace(/"/g,'""')}"`,
         `"${r.description.replace(/"/g,'""')}"`].join(',')
    );
    triggerDownload([header, ...rows].join('\n'), 'symbihackathon2026_problems.csv', 'text/csv');
}

function triggerDownload(content, filename, type) {
    const blob = new Blob([content], { type });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

// ── Utility ───────────────────────────────────────────────────────
function escHtml(s) {
    return String(s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Column header click sort ──────────────────────────────────────
document.querySelectorAll('#ps-table th[data-col]').forEach(th => {
    th.addEventListener('click', () => {
        const col = th.dataset.col;
        if (sortCol === col) {
            sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
            sortCol = col;
            sortDir = 'asc';
        }

        // Update sort select to match
        const map = { sno:'sno', id:'id', title:'title', domain:'domain' };
        sortSelect.value = sortDir === 'desc' && col === 'sno' ? 'sno-desc' : (map[col] || '');

        // Update header styles
        document.querySelectorAll('#ps-table th').forEach(t => t.classList.remove('sorted'));
        th.classList.add('sorted');
        th.querySelector('.sort-arrow').textContent = sortDir === 'asc' ? ' ↑' : ' ↓';

        applySort();
    });
});

// ── Event listeners ───────────────────────────────────────────────
searchInput.addEventListener('input', () => { currentPage = 1; applyFilters(); });
domainFilter.addEventListener('change', () => { currentPage = 1; applyFilters(); });
sortSelect.addEventListener('change', applySort);
rowsSelect.addEventListener('change', () => {
    rowsPerPage = rowsSelect.value === 'all' ? 'all' : parseInt(rowsSelect.value);
    currentPage = 1;
    renderTable();
});
downloadBtn.addEventListener('click', downloadFilteredCSV);

// ── Init — auto-fetch CSV from assets ────────────────────────────
autoLoadCSV();