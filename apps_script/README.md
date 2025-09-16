Google Apps Script — Waitlist Collector

Quick setup
- Create a Google Sheet, keep the default Sheet1 or rename and update code.
- Copy the Sheet ID from the URL: https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit
- In code.gs, set SHEET_ID to that value.

Deploy as Web App
- In Apps Script: Deploy > New deployment > Type: Web app
- Execute as: Me
- Who has access: Anyone
- Copy the Web app URL and paste it into `config.js` as `submitEndpoint`.

Columns written
- Timestamp, Email, Referrer, Path, UserAgent

Notes
- The script accepts JSON (preferred) or form-encoded.
- For simplest client integration, use fetch with `mode: 'no-cors'` (already set in script.js).

