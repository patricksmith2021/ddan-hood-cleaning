export async function onRequestGet(context) {
  const { env } = context;
  const results = {};

  // Test 1: Check which env vars exist
  results.envCheck = {
    SMTP2GO_API_KEY: env.SMTP2GO_API_KEY ? 'SET (' + env.SMTP2GO_API_KEY.substring(0, 4) + '...)' : 'MISSING',
    TWILIO_ACCOUNT_SID: env.TWILIO_ACCOUNT_SID ? 'SET (' + env.TWILIO_ACCOUNT_SID.substring(0, 4) + '...)' : 'MISSING',
    TWILIO_AUTH_TOKEN: env.TWILIO_AUTH_TOKEN ? 'SET' : 'MISSING',
    TWILIO_PHONE_NUMBER: env.TWILIO_PHONE_NUMBER ? 'SET' : 'MISSING',
    GOOGLE_SHEET_ID: env.GOOGLE_SHEET_ID ? 'SET (' + env.GOOGLE_SHEET_ID.substring(0, 8) + '...)' : 'MISSING',
    GOOGLE_SERVICE_ACCOUNT_JSON: env.GOOGLE_SERVICE_ACCOUNT_JSON ? 'SET (length: ' + env.GOOGLE_SERVICE_ACCOUNT_JSON.length + ')' : 'MISSING',
    TURNSTILE_SECRET_KEY: env.TURNSTILE_SECRET_KEY ? 'SET' : 'MISSING',
    API_KEY: env.API_KEY ? 'SET' : 'MISSING'
  };

  // Test 2: Try SMTP2GO
  try {
    const emailRes = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: env.SMTP2GO_API_KEY,
        sender: 'leads@ddanhoodcleaning.com',
        to: ['patricksmith.phd@gmail.com'],
        subject: 'DDAN Test Email - Diagnostic',
        html_body: '<h2>Test email from DDAN lead router diagnostic</h2><p>If you see this, SMTP2GO is working.</p>',
        text_body: 'Test email from DDAN lead router diagnostic. If you see this, SMTP2GO is working.'
      })
    });
    const emailText = await emailRes.text();
    results.smtp2go = { status: emailRes.status, response: emailText };
  } catch (e) {
    results.smtp2go = { error: e.message };
  }

  // Test 3: Try Google Sheets — just parse the JSON key first
  try {
    const raw = env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const sa = JSON.parse(raw);
    results.sheetsKeyParse = {
      success: true,
      client_email: sa.client_email,
      project_id: sa.project_id,
      has_private_key: sa.private_key ? 'YES (length: ' + sa.private_key.length + ')' : 'NO'
    };

    // Try to create JWT and get access token
    const now = Math.floor(Date.now() / 1000);
    const headerB64 = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const claimB64 = btoa(JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600
    })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    const pem = sa.private_key
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace(/\n/g, '');
    const keyBytes = Uint8Array.from(atob(pem), c => c.charCodeAt(0));

    const key = await crypto.subtle.importKey(
      'pkcs8', keyBytes,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false, ['sign']
    );

    const sig = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5', key,
      new TextEncoder().encode(headerB64 + '.' + claimB64)
    );
    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    const jwt = headerB64 + '.' + claimB64 + '.' + sigB64;

    results.sheetsJWT = { success: true, jwtLength: jwt.length };

    // Get access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt
    });
    const tokenText = await tokenRes.text();
    results.sheetsToken = { status: tokenRes.status, response: tokenText.substring(0, 300) };

    // If we got a token, try appending a test row
    const tokenData = JSON.parse(tokenText);
    if (tokenData.access_token) {
      const sheetRes = await fetch(
        'https://sheets.googleapis.com/v4/spreadsheets/' + env.GOOGLE_SHEET_ID + '/values/Test%20Leads!A:N:append?valueInputOption=USER_ENTERED',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + tokenData.access_token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [['DIAGNOSTIC TEST', new Date().toISOString(), 'test', 'Test', 'User', '5551234', 'test@test.com', 'Test Biz', '123 Test St', 'Diagnostic', 'No', 'No', 'Diagnostic test', '/test']]
          })
        }
      );
      const sheetText = await sheetRes.text();
      results.sheetsAppend = { status: sheetRes.status, response: sheetText.substring(0, 300) };
    }

  } catch (e) {
    results.sheetsError = { error: e.message, stack: e.stack ? e.stack.substring(0, 300) : 'no stack' };
  }

  return new Response(JSON.stringify(results, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
}
