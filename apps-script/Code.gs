/**
 * The Quiet Questions: response recorder.
 *
 * Bind this script to a Google Sheet (Extensions > Apps Script), then
 * Deploy > New deployment > Web app, with "Execute as: Me" and
 * "Who has access: Anyone". Paste the /exec URL into RESPONSE_ENDPOINT
 * in index.html. Every session becomes one row in the "Responses" tab.
 *
 * Version 2: the page saves after every answer and sends a session id.
 * The row for that session is updated in place, so unfinished sessions
 * are kept and finished ones still take a single row.
 */
const VERSION = 2;
const SHEET_NAME = 'Responses';
const MAX_COLUMNS = 60;
const MAX_CELL = 1000;
const SESSION_COLUMN = 'Session';
const STEP_COLUMN = 'Answers given';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const columns = Array.isArray(body.columns) ? body.columns : [];
    const values = Array.isArray(body.values) ? body.values : [];
    if (!columns.length || columns.length !== values.length || columns.length > MAX_COLUMNS) {
      return json({ ok: false, error: 'Unexpected payload shape' });
    }
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    const header = ['Received'].concat(columns.map(clean));
    writeHeader(sheet, header);
    const row = [new Date()].concat(values.map(clean));

    const session = typeof body.session === 'string' ? body.session.slice(0, 64) : '';
    const sessionCol = header.indexOf(SESSION_COLUMN) + 1;
    const last = sheet.getLastRow();
    if (session && sessionCol > 0 && last > 1) {
      const hit = sheet.getRange(2, sessionCol, last - 1, 1).createTextFinder(session).matchEntireCell(true).findNext();
      if (hit) {
        const r = hit.getRow();
        // Saves can arrive out of order; never let an older one overwrite a newer one.
        const stepCol = header.indexOf(STEP_COLUMN) + 1;
        const stored = stepCol > 0 ? Number(sheet.getRange(r, stepCol).getValue()) || 0 : 0;
        if ((Number(body.step) || 0) < stored) return json({ ok: true, stale: true });
        row[0] = sheet.getRange(r, 1).getValue(); // keep the time the session was first received
        sheet.getRange(r, 1, 1, row.length).setValues([row]);
        return json({ ok: true, updated: r });
      }
    }
    sheet.appendRow(row);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Opening the /exec URL in a browser shows this, which confirms the deployment is live.
// The page also reads `version` to decide whether it can save after every answer.
function doGet() {
  return json({ ok: true, service: 'quiet-questions-recorder', version: VERSION });
}

// Keeps row 1 in step with the page's columns, so new columns appear with a heading.
function writeHeader(sheet, header) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(header);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, header.length).setFontWeight('bold');
    return;
  }
  const range = sheet.getRange(1, 1, 1, header.length);
  if (range.getDisplayValues()[0].join('\u0001') !== header.join('\u0001')) {
    range.setValues([header]).setFontWeight('bold');
  }
}

function clean(v) {
  let s = String(v == null ? '' : v).slice(0, MAX_CELL);
  // Respondents type their own name, so stop anything that starts like a formula from running.
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
