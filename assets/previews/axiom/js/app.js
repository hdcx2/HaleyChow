import { upload, post, request } from './api.js?v=axiom-6';
import { drawGraph } from './graph.js?v=axiom-6';

const $ = id => document.getElementById(id);
const SESSION_KEY = 'axiom-local-session-v1';
const state = { filename: '', text: '', concepts: [], relationships: [], graph: null, resultGraph: null, analysis: null, review: null, summary: null, sample: false };
const sampleText = `Cellular respiration is the process by which cells release energy from glucose. In the presence of oxygen, glucose is broken down in the mitochondria. This process produces ATP, which provides usable energy for cell activities. Glycolysis begins the breakdown of glucose in the cytoplasm. The Krebs cycle and electron transport chain continue the process in the mitochondria. Oxygen accepts electrons at the end of the electron transport chain, allowing ATP production to continue. Without oxygen, cells can produce less ATP through fermentation.`;
const sampleExplanation = `Cells release energy from glucose through cellular respiration. Glycolysis starts breaking glucose down, and the Krebs cycle and electron transport chain continue the process in the mitochondria. Oxygen helps the electron transport chain keep working so the cell can produce ATP. ATP supplies usable energy for cell activities.`;

function notice(message, type = '') {
  const n = $('notice'); n.textContent = message; n.className = `notice ${type}`; n.hidden = false;
}
function guide(step, message) {
  if (!state.sample) return;
  $('sample-guide').hidden = false;
  $('guide-step').textContent = `SAMPLE WALKTHROUGH / ${step} OF 4`;
  $('guide-message').textContent = message;
}
function moveTo(n) {
  document.querySelectorAll('.stepper span').forEach((x, i) => {
    x.classList.toggle('active', i === n); x.classList.toggle('done', i < n);
  });
  $('step-label').textContent = ['01 — SOURCE', '02 — CONCEPTS', '03 — EXPLAIN', '04 — FINDINGS'][n];
}
function show(id) {
  ['source-panel', 'concept-panel', 'explanation-panel', 'results-panel'].forEach(x => $(x).hidden = x !== id);
  moveTo(['source-panel', 'concept-panel', 'explanation-panel', 'results-panel'].indexOf(id));
  $('reset-button').hidden = false;
}
function reset() {
  Object.assign(state, { filename: '', text: '', concepts: [], relationships: [], graph: null, resultGraph: null, analysis: null, review: null, summary: null, sample: false });
  $('file-input').value = ''; $('source-text').value = ''; $('explanation').value = '';
  $('preview-wrap').hidden = true; $('concept-editor').replaceChildren(); $('notice').hidden = true;
  $('sample-guide').hidden = true; $('review-panel').hidden = true; $('review-items').replaceChildren();
  $('reset-button').hidden = true; show('source-panel');
  document.querySelector('.workspace-head h2').textContent = 'Start with a source.';
  document.querySelectorAll('.stepper span').forEach((x, i) => { x.classList.toggle('active', i === 0); x.classList.remove('done'); });
  updateSessionTools();
}
async function loadText(text, filename) {
  state.text = text; state.filename = filename; $('source-text').value = text;
  $('filename-label').textContent = filename; $('char-count').textContent = `${text.length.toLocaleString()} CHARACTERS`;
  $('preview-wrap').hidden = false; notice(`Text extracted from ${filename}. Review it below, then continue.`, 'success');
  updateSessionTools();
}
async function acceptFile(file) {
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) return notice('That file is over the 10 MB limit.', 'error');
  if (!/\.(pdf|txt)$/i.test(file.name)) return notice('Choose a PDF or TXT file.', 'error');
  notice('Reading your source material…');
  try { const result = await upload(file); await loadText(result.text, result.filename); }
  catch (e) { notice(e.message, 'error'); }
}
function renderEditor() {
  const box = $('concept-editor'); box.replaceChildren();
  state.concepts.forEach((c, i) => {
    const row = document.createElement('div'); row.className = 'concept-row';
    const input = document.createElement('input'); input.value = c.name; input.setAttribute('aria-label', `Concept ${i + 1} name`);
    input.addEventListener('input', () => { state.concepts[i].name = input.value; updateSessionTools(); });
    const del = document.createElement('button'); del.textContent = '×'; del.title = 'Remove concept'; del.setAttribute('aria-label', `Remove ${c.name}`);
    del.onclick = () => { state.concepts.splice(i, 1); state.relationships = state.relationships.filter(r => r.source !== c.id && r.target !== c.id); renderEditor(); };
    row.append(input, del); box.append(row);
  });
  $('concept-count').textContent = `${state.concepts.length} CONCEPTS`; renderGraph(); updateSessionTools();
}
function renderGraph(status = {}) {
  state.graph = drawGraph($('graph'), { nodes: state.concepts, links: state.relationships }, c => {
    $('concept-detail').textContent = `${c.name} — ${c.evidence || c.definition || 'No source evidence.'}`;
  }, status);
}
function focusFinding(item, type) {
  let ids = [item.id];
  if (type === 'relationship') {
    const relation = state.relationships.find(r => r.id === item.id);
    ids = relation ? [relation.source, relation.target] : [];
  }
  if (ids.length) state.resultGraph?.focus(ids);
  const detail = $('results-focus-evidence');
  detail.textContent = `${item.name}. Source evidence: ${item.sourceEvidence || 'No source evidence attached.'}${item.studentEvidence ? ` Your words: ${item.studentEvidence}` : ''}`;
  $('results-map').scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function finding(item, type) {
  const el = document.createElement('article'); el.className = 'finding clickable-finding';
  el.tabIndex = 0; el.setAttribute('role', 'button'); el.setAttribute('aria-label', `Focus ${item.name} in the graph`);
  const head = document.createElement('div'); head.className = 'finding-head';
  const h = document.createElement('h4'); h.textContent = item.name;
  const badge = document.createElement('span'); badge.className = `badge ${item.status}`; badge.textContent = item.status;
  head.append(h, badge); const why = document.createElement('p'); why.textContent = item.reason; el.append(head, why);
  if (item.sourceEvidence) { const evidence = document.createElement('div'); evidence.className = 'evidence'; evidence.innerHTML = '<strong>Source:</strong> '; evidence.append(document.createTextNode(item.sourceEvidence)); el.append(evidence); }
  if (item.studentEvidence) { const evidence = document.createElement('div'); evidence.className = 'evidence'; evidence.style.marginTop = '5px'; evidence.innerHTML = '<strong>Your words:</strong> '; evidence.append(document.createTextNode(item.studentEvidence)); el.append(evidence); }
  el.addEventListener('click', () => focusFinding(item, type));
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); focusFinding(item, type); } });
  return el;
}
function showResults(data) {
  state.analysis = data; $('summary').textContent = data.summary; $('analysis-note').textContent = data.disclaimer;
  $('coverage-list').replaceChildren(); $('relationship-list').replaceChildren();
  data.concepts.forEach(x => $('coverage-list').append(finding(x, 'concept')));
  if (!data.relationships.length) $('relationship-list').textContent = 'No explicit source relationships were extracted. Edit the concept map or use notes with clear relationship statements.';
  else data.relationships.forEach(x => $('relationship-list').append(finding(x, 'relationship')));
  show('results-panel');
  const status = Object.fromEntries(data.concepts.map(c => [c.id, c.status]));
  state.resultGraph = drawGraph($('results-graph'), { nodes: state.concepts, links: state.relationships }, c => {
    $('results-focus-evidence').textContent = `${c.name} — ${c.evidence || c.definition || 'No source evidence.'}`;
  }, status);
  if (state.sample) guide(4, 'Click any finding to highlight its concept in the map. Build a review set to track the topics you revisit.');
  updateSessionTools();
}


function addSummaryList(parent, title, items, makeRow) {
  if (!Array.isArray(items) || !items.length) return;
  const section = document.createElement('section'); section.className = 'summary-section';
  const heading = document.createElement('h4'); heading.textContent = title; section.append(heading);
  const list = document.createElement('ul');
  items.forEach(item => { const row = document.createElement('li'); makeRow(row, item); list.append(row); });
  section.append(list); parent.append(section);
}
function renderSummary(data) {
  state.summary = data;
  $('summary-title').textContent = data.title || 'Study guide from your notes';
  const content = $('summary-content'); content.replaceChildren();
  const overview = document.createElement('section'); overview.className = 'summary-overview';
  const label = document.createElement('h4'); label.textContent = 'Big picture';
  const text = document.createElement('p'); text.textContent = data.overview || ''; overview.append(label, text); content.append(overview);
  addSummaryList(content, 'Main ideas', data.key_points, (row, item) => {
    const idea = document.createElement('p'); idea.textContent = item.idea || String(item); row.append(idea);
    if (item.source_quote) { const quote = document.createElement('blockquote'); quote.textContent = `From your notes: “${item.source_quote}”`; row.append(quote); }
  });
  addSummaryList(content, 'Key terms', data.key_terms, (row, item) => {
    const strong = document.createElement('strong'); strong.textContent = item.term || ''; const meaning = document.createElement('span'); meaning.textContent = item.plain_definition || ''; row.append(strong, meaning);
    if (item.source_quote) { const quote = document.createElement('blockquote'); quote.textContent = `From your notes: “${item.source_quote}”`; row.append(quote); }
  });
  addSummaryList(content, 'How the ideas connect', data.connections, (row, item) => { row.textContent = String(item); });
  addSummaryList(content, 'Remember', data.remember, (row, item) => { row.textContent = String(item); });
  addSummaryList(content, 'Check what you know', data.practice_questions, (row, item) => { row.textContent = String(item); });
  $('summary-disclaimer').textContent = data.notice || 'Check the source notes to verify details.';
  $('summary-panel').hidden = false; $('summary-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateSessionTools();
}
async function createSummary() {
  const source = $('source-text').value.trim();
  const button = $('summary-button'); button.disabled = true; button.textContent = 'Building your guide…';
  try { renderSummary(await post('/api/summarize', { text: source })); }
  catch (error) { notice(error.message, 'error'); }
  finally { button.disabled = false; request('/api/health').then(data => { button.innerHTML = data.openAIEnabled ? 'Create AI study guide <span>✦</span>' : 'Create offline study guide <span>✦</span>'; }); }
}
function downloadSummary() {
  const data = state.summary; if (!data) return;
  const lines = [`# ${data.title}`, '', '## Big picture', data.overview, ''];
  for (const [heading, entries, format] of [
    ['Main ideas', data.key_points, item => `- ${item.idea}${item.source_quote ? `\n  - Source: “${item.source_quote}”` : ''}`],
    ['Key terms', data.key_terms, item => `- **${item.term}**: ${item.plain_definition}${item.source_quote ? `\n  - Source: “${item.source_quote}”` : ''}`],
    ['How the ideas connect', data.connections, item => `- ${item}`], ['Remember', data.remember, item => `- ${item}`],
    ['Check what you know', data.practice_questions, item => `- ${item}`]
  ]) { if (entries?.length) lines.push(`## ${heading}`, ...entries.map(format), ''); }
  lines.push(data.notice || '');
  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/markdown' }));
  const link = document.createElement('a'); link.href = url; link.download = 'axiom-study-guide.md'; link.click(); URL.revokeObjectURL(url);
}

function updateSessionTools() {
  const hasSession = Boolean(state.text);
  const hasSaved = Boolean(localStorage.getItem(SESSION_KEY));
  $('save-session').disabled = !hasSession;
  $('export-session').disabled = !hasSession;
  $('restore-session').disabled = !hasSaved;
  $('clear-saved').disabled = !hasSaved;
}
function sessionData() {
  const currentText = $('preview-wrap').hidden ? state.text : $('source-text').value;
  return {
    version: 1, savedAt: new Date().toISOString(), filename: state.filename, text: currentText,
    concepts: state.concepts, relationships: state.relationships, explanation: $('explanation').value,
    analysis: state.analysis, review: state.review, summary: state.summary,
    reviewed: [...$('review-items').querySelectorAll('input[type="checkbox"]')].map(input => input.checked)
  };
}
function saveSession() {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData()));
    $('session-status').textContent = 'Saved in this browser on this device.';
    updateSessionTools();
  } catch {
    $('session-status').textContent = 'Could not save. Browser storage may be full or disabled.';
  }
}
function exportSession() {
  const blob = new Blob([JSON.stringify(sessionData(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob); const link = document.createElement('a');
  link.href = url; link.download = `axiom-session-${new Date().toISOString().slice(0, 10)}.json`;
  link.click(); URL.revokeObjectURL(url);
}
function renderReview(data, reviewed = []) {
  state.review = data;
  const box = $('review-items'); box.replaceChildren();
  if (!data.questions.length) box.textContent = 'No gaps were detected by this heuristic. Review all concepts in the graph to check your understanding.';
  data.questions.forEach((q, i) => {
    const row = document.createElement('label'); row.className = 'review-item';
    const check = document.createElement('input'); check.type = 'checkbox'; check.checked = Boolean(reviewed[i]);
    check.setAttribute('aria-label', `Mark question ${i + 1} reviewed`); check.addEventListener('change', updateReviewProgress);
    const text = document.createElement('p'); text.textContent = q.prompt;
    const evidence = document.createElement('small'); evidence.textContent = q.evidence ? `Source: ${q.evidence}` : 'Connection question';
    text.append(evidence); row.append(check, text); box.append(row);
  });
  updateReviewProgress(); $('review-panel').hidden = false; updateSessionTools();
}
async function restoreSession() {
  try {
    const data = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (!data || data.version !== 1 || typeof data.text !== 'string' || !Array.isArray(data.concepts)) throw new Error('Saved session is not valid.');
    reset(); state.filename = data.filename || 'restored-session.txt'; state.concepts = data.concepts; state.relationships = Array.isArray(data.relationships) ? data.relationships : [];
    state.analysis = data.analysis || null; state.text = data.text; state.review = data.review || null; state.summary = data.summary || null;
    await loadText(state.text, state.filename); renderEditor(); $('explanation').value = data.explanation || '';
    $('explanation').dispatchEvent(new Event('input'));
    if (state.summary) renderSummary(state.summary);
    if (state.analysis) {
      showResults(state.analysis);
      if (state.review) renderReview(state.review, Array.isArray(data.reviewed) ? data.reviewed : []);
    } else if (state.concepts.length) show('concept-panel');
    else show('source-panel');
    document.querySelector('.workspace-head h2').textContent = state.analysis ? 'Resume your analysis.' : 'Restored study session.';
    $('session-status').textContent = `Restored saved session${data.savedAt ? ` from ${new Date(data.savedAt).toLocaleString()}` : ''}.`;
  } catch (error) {
    $('session-status').textContent = error instanceof SyntaxError ? 'Saved session could not be read.' : error.message;
  }
}

$('file-input').addEventListener('change', e => acceptFile(e.target.files[0]));
const drop = $('dropzone');
drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('dragging'); });
drop.addEventListener('dragleave', () => drop.classList.remove('dragging'));
drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('dragging'); acceptFile(e.dataTransfer.files[0]); });
async function sample() {
  reset(); state.sample = true; await loadText(sampleText, 'sample-cellular-respiration.txt');
  document.querySelector('.workspace-head h2').textContent = 'Explore a sample analysis.';
  guide(1, 'Review the sample notes, then choose “Extract concepts” to build the map.');
  $('workspace').scrollIntoView({ behavior: 'smooth' });
}
$('sample-button').onclick = sample; $('load-sample').onclick = sample;
$('reset-button').onclick = reset; $('restart-analysis').onclick = reset;
$('guide-close').onclick = () => { $('sample-guide').hidden = true; state.sample = false; };
$('save-session').onclick = saveSession;
$('download-summary').onclick = downloadSummary;
$('summary-button').onclick = createSummary;
$('restore-session').onclick = restoreSession;
$('export-session').onclick = exportSession;
$('clear-saved').onclick = () => {
  if (!window.confirm('Delete the saved AXIOM session from this browser?')) return;
  localStorage.removeItem(SESSION_KEY); $('session-status').textContent = 'Saved session deleted from this browser.'; updateSessionTools();
};
$('extract-button').onclick = async () => {
  state.text = $('source-text').value;
  if (state.text.trim().length < 40) return notice('Add at least 40 characters of readable source material.', 'error');
  const b = $('extract-button'); b.disabled = true; b.textContent = 'Extracting…';
  try {
    const data = await post('/api/extract-concepts', { text: state.text }); state.concepts = data.concepts; state.relationships = data.relationships;
    renderEditor(); show('concept-panel'); if (state.sample) guide(2, 'Explore the animated graph and select nodes to inspect evidence. When you are ready, choose “Write explanation”.');
  } catch (e) { notice(e.message, 'error'); }
  finally { b.disabled = false; b.innerHTML = 'Extract concepts <span>↗</span>'; }
};
$('add-concept').onclick = () => { state.concepts.push({ id: `manual-${Date.now()}`, name: 'New concept', definition: '', evidence: '' }); renderEditor(); };
$('reset-graph').onclick = () => state.graph?.reset();
$('reset-result-graph').onclick = () => { state.resultGraph?.reset(); $('results-focus-evidence').textContent = 'Select a finding below to focus its concept and inspect the evidence.'; };
$('to-explain').onclick = () => {
  show('explanation-panel');
  if (state.sample && !$('explanation').value) { $('explanation').value = sampleExplanation; $('explanation').dispatchEvent(new Event('input')); }
  if (state.sample) guide(3, 'A sample explanation is ready for you to edit. Read it in your own words, then run the analysis.');
  $('explanation').focus();
};
$('clear-explanation').onclick = () => { $('explanation').value = ''; $('word-count').textContent = '0 words'; };
$('explanation').addEventListener('input', () => { $('word-count').textContent = `${$('explanation').value.trim() ? $('explanation').value.trim().split(/\s+/).length : 0} words`; updateSessionTools(); });
$('analyze-button').onclick = async () => {
  const b = $('analyze-button'); b.disabled = true; b.textContent = 'Checking evidence…';
  try { showResults(await post('/api/analyze', { concepts: state.concepts, relationships: state.relationships, explanation: $('explanation').value })); }
  catch (e) { notice(e.message, 'error'); }
  finally { b.disabled = false; b.innerHTML = 'Analyze explanation <span>↗</span>'; }
};
$('edit-explanation').onclick = () => show('explanation-panel');
function updateReviewProgress() {
  const checks = [...$('review-items').querySelectorAll('input[type="checkbox"]')];
  const done = checks.filter(c => c.checked).length; const total = checks.length;
  $('review-progress').max = Math.max(1, total); $('review-progress').value = done;
  $('review-progress-text').textContent = `${done} / ${total} REVIEWED`;
}
$('review-button').onclick = async () => {
  try {
    const data = await post('/api/review-questions', { analysis: state.analysis, concepts: state.concepts }); state.review = data;
    renderReview(data); $('review-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) { notice(e.message, 'error'); }
};
updateSessionTools();
request('/api/health').then(data => {
  $('local-mode').textContent = data.analysisMode || 'LOCAL RULE-BASED MODE';
  $('summary-mode-note').textContent = data.openAIEnabled
    ? 'AI study guide is ready. Clicking the button sends these notes to OpenAI.'
    : 'Offline guide is ready. Add an OpenAI key in .env for a plain-language AI study guide.';
  $('summary-button').innerHTML = data.openAIEnabled ? 'Create AI study guide <span>✦</span>' : 'Create offline study guide <span>✦</span>';
  $('summary-button').className = data.openAIEnabled ? 'button primary' : 'button secondary';
}).catch(() => notice('Could not reach the local server. Start AXIOM from the VS Code terminal and reload.', 'error'));
