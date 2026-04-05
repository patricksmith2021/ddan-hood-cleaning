export async function onRequestPost(context) {
  const { request, env } = context;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    const body = await request.json();

    // Turnstile verification
    const token = body['cf-turnstile-response'] || '';
    if (token) {
      try {
        const tv = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token })
        });
        const tr = await tv.json();
        if (!tr.success) {
          return new Response(JSON.stringify({ error: 'Security check failed' }), { status: 403, headers });
        }
      } catch (e) {
        console.error('Turnstile error:', e.message);
      }
    }

    // Validate
    if (!body.firstName || !body.phone) {
      return new Response(JSON.stringify({ error: 'Name and phone required' }), { status: 400, headers });
    }

    // Build lead
    const lead = {
      date: new Date().toLocaleDateString('en-US', { timeZone: 'America/Chicago' }),
      time: new Date().toLocaleTimeString('en-US', { timeZone: 'America/Chicago' }),
      source: body.source || 'website',
      firstName: (body.firstName || '').trim(),
      lastName: (body.lastName || '').trim(),
      phone: (body.phone || '').trim(),
      email: (body.email || '').trim(),
      businessName: (body.businessName || '').trim(),
      businessAddress: (body.businessAddress || '').trim(),
      service: body.service || 'Not specified',
      multipleLocations: body.multipleLocations || 'No',
      flatRoof: body.flatRoof || 'No',
      comments: (body.comments || '').trim(),
      pageUrl: body.page_url || ''
    };

    const name = lead.firstName + ' ' + lead.lastName;
    const debug = {};

    // 1. TEAM EMAIL via SMTP2GO
    try {
      const emailRes = await fetch('https://api.smtp2go.com/v3/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          api_key: env.SMTP2GO_API_KEY,
          sender: 'DDAN Leads <leads@ddanhoodcleaning.com>',
          to: ['patricksmith.phd@gmail.com'],
          subject: 'New DDAN Lead: ' + name + ' - ' + lead.service,
          html_body: '<h2>New Lead</h2><p><b>Name:</b> ' + name + '</p><p><b>Phone:</b> <a href="tel:' + lead.phone + '">' + lead.phone + '</a></p><p><b>Email:</b> ' + (lead.email || 'N/A') + '</p><p><b>Business:</b> ' + (lead.businessName || 'N/A') + '</p><p><b>Address:</b> ' + (lead.businessAddress || 'N/A') + '</p><p><b>Service:</b> ' + lead.service + '</p><p><b>Source:</b> ' + lead.source + '</p><p><b>Page:</b> ' + lead.pageUrl + '</p><p><b>Time:</b> ' + lead.date + ' ' + lead.time + '</p>',
          text_body: 'New lead: ' + name + ' | ' + lead.phone + ' | ' + lead.service
        })
      });
      const emailData = await emailRes.json();
      debug.teamEmail = { status: emailRes.status, response: emailData };
    } catch (e) {
      debug.teamEmail = { error: e.message };
    }

    // 2. CUSTOMER EMAIL via SMTP2GO
    if (lead.email) {
      try {
        const custRes = await fetch('https://api.smtp2go.com/v3/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            api_key: env.SMTP2GO_API_KEY,
            sender: 'DDAN Hood Cleaning <service@ddanhoodcleaning.com>',
            to: [lead.email],
            subject: 'Thanks for contacting DDAN Hood Cleaning!',
            html_body: '<p>Hi ' + lead.firstName + ',</p><p>We received your request and will get back to you shortly.</p><p>For immediate help: <a href="tel:6158816968"><b>(615) 881-6968</b></a> — available 24/7</p><p>— DDAN Hood Cleaning and Repair</p>',
            text_body: 'Hi ' + lead.firstName + ', thanks for contacting DDAN Hood Cleaning! We will get back to you shortly. For immediate help call (615) 881-6968.'
          })
        });
        const custData = await custRes.json();
        debug.customerEmail = { status: custRes.status, response: custData };
      } catch (e) {
        debug.customerEmail = { error: e.message };
      }
    }

    // 3. TEAM SMS via Twilio
    try {
      const smsRes = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + env.TWILIO_ACCOUNT_SID + '/Messages.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(env.TWILIO_ACCOUNT_SID + ':' + env.TWILIO_AUTH_TOKEN)
        },
        body: new URLSearchParams({
          To: '+12289346002',
          From: env.TWILIO_PHONE_NUMBER,
          Body: 'New DDAN lead: ' + name + ' | ' + lead.phone + ' | ' + lead.service + ' | ' + lead.pageUrl
        })
      });
      const smsData = await smsRes.json();
      debug.teamSms = { status: smsRes.status, sid: smsData.sid || smsData.message };
    } catch (e) {
      debug.teamSms = { error: e.message };
    }

    // 4. CUSTOMER SMS via Twilio
    if (lead.phone) {
      try {
        const custSmsRes = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + env.TWILIO_ACCOUNT_SID + '/Messages.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(env.TWILIO_ACCOUNT_SID + ':' + env.TWILIO_AUTH_TOKEN)
          },
          body: new URLSearchParams({
            To: lead.phone,
            From: env.TWILIO_PHONE_NUMBER,
            Body: 'Thanks for contacting DDAN Hood Cleaning! We received your request and will get back to you shortly. For immediate help call (615) 881-6968.'
          })
        });
        const custSmsData = await custSmsRes.json();
        debug.customerSms = { status: custSmsRes.status, sid: custSmsData.sid || custSmsData.message };
      } catch (e) {
        debug.customerSms = { error: e.message };
      }
    }

    // 5. GOOGLE SHEETS
    try {
      const sa = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);

      // Create JWT
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

      // Get access token
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt
      });
      const tokenData = await tokenRes.json();

      if (!tokenData.access_token) {
        throw new Error('No access token: ' + JSON.stringify(tokenData));
      }

      // Append to sheet
      const sheetRes = await fetch(
        'https://sheets.googleapis.com/v4/spreadsheets/' + env.GOOGLE_SHEET_ID + '/values/Website%20Leads!A:N:append?valueInputOption=USER_ENTERED',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + tokenData.access_token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [[
              lead.date, lead.time, lead.source, lead.firstName, lead.lastName,
              lead.phone, lead.email, lead.businessName, lead.businessAddress,
              lead.service, lead.multipleLocations, lead.flatRoof, lead.comments, lead.pageUrl
            ]]
          })
        }
      );
      const sheetData = await sheetRes.json();
      debug.sheets = { status: sheetRes.status, response: sheetData };
    } catch (e) {
      debug.sheets = { error: e.message, stack: e.stack?.substring(0, 200) };
    }

    return new Response(JSON.stringify({ success: true, debug }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, stack: err.stack?.substring(0, 300) }), { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
