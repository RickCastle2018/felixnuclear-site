// Optional client-only config. You can leave as-is.
// To send emails to a Google Sheet, set one of the endpoints:
// - Using Google Forms (no code): set submitEndpoint to your form's formResponse URL
//   and googleFormField to the entry.<id> for the email field.
// - Using Apps Script (custom): deploy a Web App (doPost), and set submitEndpoint to that URL.

window.FN_CONFIG = {
  submitEndpoint: "https://script.google.com/macros/s/AKfycbw9BCaLIdXISp6vE6gbU9F6ndPN8Hk33VTQS7Fpx5vXz9U35scIZp3AIcv7URH9Jjfs/exec",
  googleForm: false,
  googleFormField: "",
};
