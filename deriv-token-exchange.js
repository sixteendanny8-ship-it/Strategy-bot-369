// Netlify serverless function.
// This is the ONLY place the OAuth2 authorization code is ever exchanged for an
// access_token. Deriv's own docs are explicit: "Never perform the token exchange
// from the browser." This function runs server-side on Netlify's infrastructure,
// never in the user's browser, so the exchange happens correctly and safely here.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  const { code, code_verifier, client_id, redirect_uri } = payload;
  if (!code || !code_verifier || !client_id || !redirect_uri) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "missing_fields",
        error_description: "code, code_verifier, client_id, and redirect_uri are all required.",
      }),
    };
  }

  try {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id,
      code,
      code_verifier,
      redirect_uri,
    });

    const res = await fetch("https://auth.deriv.com/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await res.json();

    return {
      statusCode: res.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "upstream_error", error_description: err.message }),
    };
  }
};
