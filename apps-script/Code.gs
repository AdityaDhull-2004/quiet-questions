/**
 * The Quiet Questions: response recorder.
 *
 * Bind this script to a Google Sheet (Extensions > Apps Script), then
 * Deploy > New deployment > Web app, with "Execute as: Me" and
 * "Who has access: Anyone". Paste the /exec URL into RESPONSE_ENDPOINT
 * in index.html. Every finished run becomes one row in the "Responses" tab.
 */
const SHEET_NAME = 'Responses';
const MAX_COLUMNS = 60;
const MAX_CELL = 1000;

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
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Received'].concat(columns.map(clean)));
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, columns.length + 1).setFontWeight('bold');
    }
    sheet.appendRow([new Date()].concat(values.map(clean)));
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Opening the /exec URL in a browser shows this, which confirms the deployment is live.
function doGet() {
  return json({ ok: true, service: 'quiet-questions-recorder' });
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
