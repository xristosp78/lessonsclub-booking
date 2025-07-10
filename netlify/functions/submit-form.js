const fetch = require("node-fetch");

exports.handler = async function(event) {
  const method = event.httpMethod;
  const query = new URLSearchParams(event.queryStringParameters);
  const action = query.get("action");

  const GAS_URL = "https://script.google.com/macros/s/AKfycbx4wFb8zKR0r8PDp7EoAXSFpxE7hDumN1myMpELwsvTgGFzkSvRWp8fdkHSjwhW87uvTg/exec";

  if (!action) {
    return { statusCode: 400, body: "❌ Missing action" };
  }

  try {
    if (method === "GET") {
      const res = await fetch(`${GAS_URL}?${query.toString()}`);
      const text = await res.text();
      return { statusCode: 200, body: text };
    }

    if (method === "POST") {
      const body = JSON.parse(event.body);
      const form = new URLSearchParams();

      Object.entries(body).forEach(([k, v]) => form.append(k, v));
      form.append("action", "submitForm");

      const res = await fetch(GAS_URL, {
        method: "POST",
        body: form,
      });

      const text = await res.text();
      return { statusCode: 200, body: JSON.stringify({ message: text }) };
    }

    return { statusCode: 405, body: "❌ Method not allowed" };
  } catch (err) {
    return { statusCode: 500, body: `❌ Server Error: ${err.message}` };
  }
};

