const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const method = event.httpMethod;
  const query = new URLSearchParams(event.queryStringParameters);
  const GAS_URL = "https://script.google.com/macros/s/AKfycbyjvQXutWHk-.../exec"; // 🔁 Βάλε το δικό σου URL εδώ

  try {
    if (method === "GET") {
      const res = await fetch(`${GAS_URL}?${query.toString()}`);

      if (!res.ok) {
        return {
          statusCode: 502,
          body: JSON.stringify({ error: "Failed to fetch from Google Apps Script" }),
        };
      }

      const data = await res.json(); // 👈 Σωστή μετατροπή από response σε JSON

      return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    // ✉️ Υποβολή φόρμας (POST)
    if (method === "POST") {
      const body = JSON.parse(event.body);
      const form = new URLSearchParams(body);

      const res = await fetch(GAS_URL, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        return {
          statusCode: 502,
          body: JSON.stringify({ error: "Failed to submit form" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

