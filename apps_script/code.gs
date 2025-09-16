/**
 * Google Apps Script Web App to accept email signups and write to a Google Sheet.
 *
 * Setup:
 * 1) Create a Google Sheet and copy its ID from the URL.
 * 2) Paste that ID into SHEET_ID below. Optionally change SHEET_NAME.
 * 3) Deploy > New deployment > Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4) Copy the Web app URL and set it as submitEndpoint in config.js.
 */

const SHEET_ID = '1i8sK6JUuElvhxz1QuXP9TgUvFtOuWpMz_yz9zpRWwPg';
const SHEET_NAME = 'Sheet1';

function appendRowSafe(values) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  sheet.appendRow(values);
}

function doPost(e) {
  try {
    let email = '';
    let meta = {};

    if (e && e.postData) {
      const type = (e.postData.type || '').toLowerCase();
      const raw = e.postData.contents || '';
      if (type.indexOf('application/json') !== -1) {
        const payload = JSON.parse(raw || '{}');
        email = (payload.email || '').trim();
        meta = payload.meta || {};
      } else {
        // form-encoded or text fallback
        email = (e.parameter && (e.parameter.email || '')) + '';
        meta = {
          ref: (e.parameter && (e.parameter.ref || '')) + '',
          path: (e.parameter && (e.parameter.path || '')) + '',
          ua: (e.parameter && (e.parameter.ua || '')) + '',
        };
        // In case body is JSON but sent as text/plain
        if (!email && raw && raw.trim().startsWith('{')) {
          try {
            const payload = JSON.parse(raw);
            email = (payload.email || '').trim();
            meta = payload.meta || meta;
          } catch (_) {}
        }
      }
    }

    if (!email) {
      return jsonResponse({ ok: false, error: 'missing_email' }, 400);
    }

    const now = new Date();
    appendRowSafe([
      now,
      email,
      meta.ref || '',
      meta.path || '',
      meta.ua || '',
    ]);

    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
}

function jsonResponse(obj, status) {
  const output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  // CORS note: Using fetch with mode: 'no-cors' avoids preflight. If you need readable
  // responses across origins, Apps Script doesn’t support setting arbitrary headers
  // via ContentService. Consider proxying or using an HTMLService wrapper.
  return output;
}
