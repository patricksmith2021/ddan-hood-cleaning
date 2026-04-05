export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    'Content-Type': 'application/json'
  };

  try {
    const body = await request.json();

    // --- TURNSTILE VERIFICATION ---
    const turnstileToken = body['cf-turnstile-response'];
    if (!turnstileToken) {
      return new Response(JSON.stringify({ error: 'Security check failed' }), { status: 400, headers: corsHeaders });
    }

    const turnstileResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
        remoteip: request.headers.get('CF-Connecting-IP')
      })
    });
    const turnstileData = await turnstileResult.json();
    if (!turnstileData.success) {
      return new Response(JSON.stringify({ error: 'Security verification failed' }), { status: 403, headers: corsHeaders });
    }

    // --- VALIDATE REQUIRED FIELDS ---
    if (!body.firstName || !body.firstName.trim()) {
      return new Response(JSON.stringify({ error: 'First name is required' }), { status: 400, headers: corsHeaders });
    }
    if (!body.lastName || !body.lastName.trim()) {
      return new Response(JSON.stringify({ error: 'Last name is required' }), { status: 400, headers: corsHeaders });
    }
    if (!body.phone || !body.phone.trim()) {
      return new Response(JSON.stringify({ error: 'Phone number is required' }), { status: 400, headers: corsHeaders });
    }

    // --- BUILD LEAD OBJECT ---
    const lead = {
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { timeZone: 'America/Chicago' }),
      time: new Date().toLocaleTimeString('en-US', { timeZone: 'America/Chicago' }),
      source: body.source || 'website',
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      phone: body.phone.trim(),
      email: (body.email || '').trim(),
      businessName: (body.businessName || '').trim(),
      businessAddress: (body.businessAddress || '').trim(),
      service: body.service || 'Not specified',
      multipleLocations: body.multipleLocations || 'No',
      flatRoof: body.flatRoof || 'No',
      comments: (body.comments || '').trim(),
      pageUrl: body.page_url || '',
      test: body.test === true
    };

    // --- DETERMINE RECIPIENTS ---
    const isTest = lead.test;
    // TEMP: All leads routed to test recipients during testing — revert before launch
    const teamEmail = 'patricksmith.phd@gmail.com';
    const teamSms = '+12289346002';
    const sheetTab = 'Test Leads';

    // --- RUN ALL NOTIFICATIONS IN PARALLEL ---
    const results = await Promise.allSettled([
      logToGoogleSheets(lead, sheetTab, env),
      sendTeamEmail(lead, teamEmail, env),
      sendTeamSms(lead, teamSms, env),
      lead.email ? sendCustomerEmail(lead, env) : Promise.resolve('no email')
    ]);

    // Log any failures
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      console.error('Notification failures:', failures.map(f => f.reason));
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });

  } catch (err) {
    console.error('Lead router error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: corsHeaders });
  }
}

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key'
    }
  });
}

// --- SMTP2GO EMAIL ---
async function sendTeamEmail(lead, toEmail, env) {
  const subject = '🔧 New Lead! — ' + lead.firstName + ' ' + lead.lastName + ' — ' + (lead.service || 'General');
  const html = '<div style="font-family:sans-serif;max-width:600px;">' +
    '<h2 style="color:#FF5E15;">New Lead from DDAN Website</h2>' +
    '<table style="width:100%;border-collapse:collapse;">' +
    '<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">' + lead.firstName + ' ' + lead.lastName + '</td></tr>' +
    '<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="tel:' + lead.phone + '">' + lead.phone + '</a></td></tr>' +
    '<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="mailto:' + lead.email + '">' + (lead.email || 'Not provided') + '</a></td></tr>' +
    '<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Business</td><td style="padding:8px;border-bottom:1px solid #eee;">' + (lead.businessName || 'Not provided') + '</td></tr>' +
    '<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Address</td><td style="padding:8px;border-bottom:1px solid #eee;">' + (lead.businessAddress || 'Not provided') + '</td></tr>' +
    '<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Service</td><td style="padding:8px;border-bottom:1px solid #eee;">' + lead.service + '</td></tr>' +
    '<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Multiple Locations</td><td style="padding:8px;border-bottom:1px solid #eee;">' + lead.multipleLocations + '</td></tr>' +
    '<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Flat Roof</td><td style="padding:8px;border-bottom:1px solid #eee;">' + lead.flatRoof + '</td></tr>' +
    '<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Comments</td><td style="padding:8px;border-bottom:1px solid #eee;">' + (lead.comments || 'None') + '</td></tr>' +
    '<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Source</td><td style="padding:8px;border-bottom:1px solid #eee;">' + lead.source + '</td></tr>' +
    '<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Page</td><td style="padding:8px;border-bottom:1px solid #eee;">' + lead.pageUrl + '</td></tr>' +
    '<tr><td style="padding:8px;font-weight:bold;">Time</td><td style="padding:8px;">' + lead.date + ' ' + lead.time + '</td></tr>' +
    '</table>' +
    (lead.test ? '<p style="color:red;font-weight:bold;">⚠️ TEST SUBMISSION</p>' : '') +
    '</div>';

  const response = await fetch('https://api.smtp2go.com/v3/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: env.SMTP2GO_API_KEY,
      sender: 'DDAN Hood Cleaning <leads@ddanhoodcleaning.com>',
      to: [toEmail],
      subject: (lead.test ? '🧪 TEST — ' : '') + subject,
      html_body: html,
      text_body: 'New lead: ' + lead.firstName + ' ' + lead.lastName + ' | Phone: ' + lead.phone + ' | Service: ' + lead.service
    })
  });

  const result = await response.json();
  if (result.data && result.data.failed > 0) {
    throw new Error('SMTP2GO failed: ' + JSON.stringify(result.data.failures));
  }
  return result;
}

// --- CUSTOMER CONFIRMATION EMAIL ---
async function sendCustomerEmail(lead, env) {
  const html = '<div style="font-family:sans-serif;max-width:600px;">' +
    '<h2 style="color:#FF5E15;">Thanks for contacting DDAN Hood Cleaning and Repair!</h2>' +
    '<p>Hi ' + lead.firstName + ',</p>' +
    '<p>We received your request and will get back to you shortly. For immediate assistance, call us anytime:</p>' +
    '<p style="font-size:24px;font-weight:bold;"><a href="tel:6158816968" style="color:#FF5E15;text-decoration:none;">(615) 881-6968</a></p>' +
    '<p>We are available 24/7 for emergencies.</p>' +
    '<p>— DDAN Hood Cleaning and Repair<br>Mt. Juliet, TN | Serving All of Middle Tennessee</p>' +
    '</div>';

  return fetch('https://api.smtp2go.com/v3/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: env.SMTP2GO_API_KEY,
      sender: 'DDAN Hood Cleaning <service@ddanhoodcleaning.com>',
      to: [lead.email],
      subject: 'Thanks for contacting DDAN Hood Cleaning and Repair!',
      html_body: html,
      custom_headers: [{ header: 'Reply-To', value: 'service@ddanhoodcleaning.com' }]
    })
  });
}

// --- TWILIO SMS ---
async function sendTeamSms(lead, toNumber, env) {
  const message = (lead.test ? '🧪 TEST — ' : '') +
    '🔧 New DDAN lead: ' + lead.firstName + ' ' + lead.lastName +
    '\nPhone: ' + lead.phone +
    '\nService: ' + lead.service +
    '\nBusiness: ' + (lead.businessName || 'N/A') +
    '\nFrom: ' + lead.pageUrl;

  const twilioUrl = 'https://api.twilio.com/2010-04-01/Accounts/' + env.TWILIO_ACCOUNT_SID + '/Messages.json';

  const response = await fetch(twilioUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(env.TWILIO_ACCOUNT_SID + ':' + env.TWILIO_AUTH_TOKEN)
    },
    body: new URLSearchParams({
      To: toNumber,
      From: env.TWILIO_PHONE_NUMBER,
      Body: message
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error('Twilio failed: ' + error);
  }
  return response.json();
}

// --- GOOGLE SHEETS ---
async function logToGoogleSheets(lead, tabName, env) {
  const serviceAccount = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);

  // Create JWT for Google API auth
  const jwt = await createGoogleJWT(serviceAccount);
  const token = await getGoogleAccessToken(jwt);

  const sheetId = env.GOOGLE_SHEET_ID;
  const range = tabName + '!A:N';

  const values = [[
    lead.date,
    lead.time,
    lead.source,
    lead.firstName,
    lead.lastName,
    lead.phone,
    lead.email,
    lead.businessName,
    lead.businessAddress,
    lead.service,
    lead.multipleLocations,
    lead.flatRoof,
    lead.comments,
    lead.pageUrl
  ]];

  const response = await fetch(
    'https://sheets.googleapis.com/v4/spreadsheets/' + sheetId + '/values/' + encodeURIComponent(range) + ':append?valueInputOption=USER_ENTERED',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error('Google Sheets failed: ' + error);
  }
  return response.json();
}

// --- GOOGLE JWT AUTH HELPERS ---
async function createGoogleJWT(serviceAccount) {
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  }));

  const unsignedToken = header + '.' + payload;

  // Import the private key
  const pemContents = serviceAccount.private_key
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\n/g, '');

  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsignedToken)
  );

  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const headerBase64 = header.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const payloadBase64 = payload.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  return headerBase64 + '.' + payloadBase64 + '.' + signatureBase64;
}

async function getGoogleAccessToken(jwt) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  const data = await response.json();
  if (!data.access_token) {
    throw new Error('Google auth failed: ' + JSON.stringify(data));
  }
  return data.access_token;
}
