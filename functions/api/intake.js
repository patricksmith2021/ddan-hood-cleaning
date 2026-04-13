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
          body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY || env.SECRET_KEY || '', response: token })
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

    // Timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) + ' CT';

    // Split timestamp for sheets: date and time
    const tsParts = timestamp.replace(' CT', '').split(', ');
    const dateStr = tsParts[0] || '';
    const timeStr = (tsParts[1] || '') + ' CT';

    // Build lead
    const lead = {
      date: dateStr,
      time: timeStr,
      timestamp: timestamp,
      source: body.source || 'website',
      firstName: (body.firstName || '').trim(),
      lastName: (body.lastName || '').trim(),
      phone: formatPhone((body.phone || '').trim()),
      phoneRaw: (body.phone || '').trim().replace(/\D/g, '').replace(/^1/, ''),
      email: (body.email || '').trim(),
      businessName: (body.businessName || '').trim(),
      businessStreetAddress: (body.businessStreetAddress || '').trim(),
      businessCity: (body.businessCity || '').trim(),
      service: body.service || 'Not specified',
      partNeeded: (body.partNeeded || '').trim(),
      multipleLocations: body.multipleLocations || 'No',
      flatRoof: body.flatRoof || 'No',
      comments: (body.comments || '').trim(),
      pageUrl: body.page_url || ''
    };

    const name = lead.firstName + ' ' + lead.lastName;
    const serviceDisplay = lead.partNeeded ? lead.service + ' — ' + lead.partNeeded : lead.service;
    const addressDisplay = (lead.businessStreetAddress && lead.businessCity)
      ? lead.businessStreetAddress + ', ' + lead.businessCity
      : lead.businessStreetAddress || lead.businessCity || 'Not provided';
    const debug = {};

    // Resolve env var names
    const SMTP_KEY = env.SMTP2GO_API_KEY || env.SMTP2GO_API || '';
    const SHEET_ID = env.GOOGLE_SHEET_ID || '';

    // Logo URL for emails
    const logoUrl = 'https://ddanhoodservices.com/images/logos/DDAN%20Hood%20Cleaning%20and%20Repair%20Logo%20Black%20BG.png';

    // 1. TEAM EMAIL via SMTP2GO — dark mode mobile-friendly
    try {
      const partRow = lead.partNeeded
        ? '<tr style="border-bottom:1px solid #333333;"><td style="color:#999999;font-size:13px;padding:12px 0;text-transform:uppercase;letter-spacing:1px;width:140px;vertical-align:top;">PART NEEDED</td><td style="color:#FFFFFF;font-size:15px;padding:12px 0;">' + lead.partNeeded + '</td></tr>'
        : '';

      const teamHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"></head>' +
        '<body style="margin:0;padding:0;background-color:#1A1A1A;font-family:Arial,Helvetica,sans-serif;">' +
        '<div style="background-color:#1A1A1A;padding:20px;max-width:600px;margin:0 auto;">' +

        // Logo
        '<div style="text-align:center;padding:20px 0;">' +
        '<img src="' + logoUrl + '" alt="DDAN Hood Services" style="max-width:200px;height:auto;" />' +
        '</div>' +

        // Header bar
        '<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="background-color:#FF5E15;padding:16px 20px;">' +
        '<span style="color:#FFFFFF;font-size:18px;font-weight:bold;letter-spacing:1px;">NEW LEAD</span>' +
        '<span style="color:#FFFFFF;font-size:14px;float:right;padding-top:3px;">' + lead.timestamp + '</span>' +
        '</td></tr></table>' +

        // Body
        '<div style="background-color:#111111;padding:24px 20px;">' +

        // Name and phone
        '<div style="border-left:4px solid #FF5E15;padding:16px 20px;margin-bottom:24px;">' +
        '<div style="color:#FFFFFF;font-size:22px;font-weight:bold;">' + name + '</div>' +
        '<div style="margin-top:8px;"><a href="tel:' + lead.phoneRaw + '" style="color:#FF5E15;font-size:18px;text-decoration:none;font-weight:bold;">' + lead.phone + '</a></div>' +
        '</div>' +

        // Details table
        '<table style="width:100%;border-collapse:collapse;">' +
        '<tr style="border-bottom:1px solid #333333;"><td style="color:#999999;font-size:13px;padding:12px 0;text-transform:uppercase;letter-spacing:1px;width:140px;vertical-align:top;">SERVICE</td><td style="color:#FF5E15;font-size:15px;padding:12px 0;">' + lead.service + '</td></tr>' +
        partRow +
        '<tr style="border-bottom:1px solid #333333;"><td style="color:#999999;font-size:13px;padding:12px 0;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">EMAIL</td><td style="padding:12px 0;">' + (lead.email ? '<a href="mailto:' + lead.email + '" style="color:#FF5E15;font-size:15px;text-decoration:none;">' + lead.email + '</a>' : '<span style="color:#666666;font-size:15px;">Not provided</span>') + '</td></tr>' +
        '<tr style="border-bottom:1px solid #333333;"><td style="color:#999999;font-size:13px;padding:12px 0;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">BUSINESS</td><td style="color:#FFFFFF;font-size:15px;padding:12px 0;">' + (lead.businessName || 'Not provided') + '</td></tr>' +
        '<tr style="border-bottom:1px solid #333333;"><td style="color:#999999;font-size:13px;padding:12px 0;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">ADDRESS</td><td style="color:#FFFFFF;font-size:15px;padding:12px 0;">' + (lead.businessStreetAddress || 'Not provided') + (lead.businessCity ? '<br/>' + lead.businessCity : '') + '</td></tr>' +
        '<tr style="border-bottom:1px solid #333333;"><td style="color:#999999;font-size:13px;padding:12px 0;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">MULTIPLE LOCATIONS</td><td style="color:#FFFFFF;font-size:15px;padding:12px 0;">' + lead.multipleLocations + '</td></tr>' +
        '<tr style="border-bottom:1px solid #333333;"><td style="color:#999999;font-size:13px;padding:12px 0;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">FLAT ROOF</td><td style="color:#FFFFFF;font-size:15px;padding:12px 0;">' + lead.flatRoof + '</td></tr>' +
        '<tr><td style="color:#999999;font-size:13px;padding:12px 0;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">COMMENTS</td><td style="color:#FFFFFF;font-size:15px;padding:12px 0;">' + (lead.comments || 'None') + '</td></tr>' +
        '</table>' +

        // Source page
        '<div style="margin-top:20px;padding-top:16px;border-top:1px solid #333333;">' +
        '<span style="color:#666666;font-size:12px;">Submitted from: ' + lead.pageUrl + '</span>' +
        '</div>' +

        '</div>' +
        '</div>' +
        '</body></html>';

      const emailRes = await fetch('https://api.smtp2go.com/v3/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: SMTP_KEY,
          sender: 'DDAN Online <online@ddanhoodservices.com>',
          to: ['patricksmith.phd@gmail.com'],
          subject: 'New Lead: ' + name + ' — ' + serviceDisplay,
          html_body: teamHtml,
          text_body: 'New DDAN Lead\nName: ' + name + '\nPhone: ' + lead.phone + '\nEmail: ' + (lead.email || 'N/A') + '\nBusiness: ' + (lead.businessName || 'N/A') + '\nService: ' + serviceDisplay + '\nTime: ' + lead.timestamp
        })
      });
      const emailData = await emailRes.json();
      debug.teamEmail = { status: emailRes.status, response: emailData };
    } catch (e) {
      debug.teamEmail = { error: e.message };
    }

    // 2. CUSTOMER EMAIL via SMTP2GO — removed "What Happens Next"
    if (lead.email) {
      try {
        const custAddress = (lead.businessStreetAddress || lead.businessCity)
          ? (lead.businessStreetAddress ? lead.businessStreetAddress + (lead.businessCity ? ', ' + lead.businessCity : '') : lead.businessCity)
          : '';

        const custHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background-color:#111111;font-family:Arial,Helvetica,sans-serif;">' +
          '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#111111;padding:20px 0;">' +
          '<tr><td align="center">' +
          '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">' +

          // Header with logo
          '<tr><td style="background-color:#000000;padding:24px 30px;text-align:center;border-bottom:3px solid #FF5E15;">' +
          '<img src="' + logoUrl + '" alt="DDAN Hood Cleaning and Repair" width="220" style="max-width:220px;height:auto;" />' +
          '</td></tr>' +

          // Main content
          '<tr><td style="background-color:#1A1A1A;padding:40px 30px;">' +

          '<h1 style="color:#FF5E15;font-size:26px;font-weight:700;margin:0 0 20px 0;text-align:center;">Thank You, ' + lead.firstName + '!</h1>' +

          '<p style="color:#D4D4D4;font-size:16px;line-height:1.7;margin:0 0 16px 0;text-align:center;">We received your service request and a member of our team will be in touch with you shortly.</p>' +

          // Phone CTA box
          '<table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">' +
          '<tr><td style="background-color:#222222;padding:24px;text-align:center;border-left:4px solid #FF5E15;border-radius:4px;">' +
          '<p style="color:#999999;font-size:14px;margin:0 0 8px 0;">Need immediate assistance? Call us 24/7:</p>' +
          '<a href="tel:6158816968" style="color:#FF5E15;font-size:28px;font-weight:700;text-decoration:none;">(615) 881-6968</a>' +
          '</td></tr>' +
          '</table>' +

          // Your request summary
          '<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">' +
          '<tr><td style="background-color:#222222;padding:20px;border-radius:4px;">' +
          '<h3 style="color:#FF5E15;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px 0;">Your Request</h3>' +
          '<table width="100%" cellpadding="0" cellspacing="0">' +
          '<tr><td style="color:#999999;font-size:13px;padding:6px 0;border-bottom:1px solid #333;">Service</td><td style="color:#FFFFFF;font-size:13px;padding:6px 0;text-align:right;border-bottom:1px solid #333;">' + serviceDisplay + '</td></tr>' +
          (lead.businessName ? '<tr><td style="color:#999999;font-size:13px;padding:6px 0;border-bottom:1px solid #333;">Business</td><td style="color:#FFFFFF;font-size:13px;padding:6px 0;text-align:right;border-bottom:1px solid #333;">' + lead.businessName + '</td></tr>' : '') +
          (custAddress ? '<tr><td style="color:#999999;font-size:13px;padding:6px 0;border-bottom:1px solid #333;">Address</td><td style="color:#FFFFFF;font-size:13px;padding:6px 0;text-align:right;border-bottom:1px solid #333;">' + custAddress + '</td></tr>' : '') +
          '<tr><td style="color:#999999;font-size:13px;padding:6px 0;border-bottom:1px solid #333;">Phone</td><td style="color:#FFFFFF;font-size:13px;padding:6px 0;text-align:right;border-bottom:1px solid #333;">' + lead.phone + '</td></tr>' +
          '<tr><td style="color:#999999;font-size:13px;padding:6px 0;border-bottom:1px solid #333;">Flat Roof</td><td style="color:#FFFFFF;font-size:13px;padding:6px 0;text-align:right;border-bottom:1px solid #333;">' + lead.flatRoof + '</td></tr>' +
          '<tr><td style="color:#999999;font-size:13px;padding:6px 0;">Multiple Locations</td><td style="color:#FFFFFF;font-size:13px;padding:6px 0;text-align:right;">' + lead.multipleLocations + '</td></tr>' +
          (lead.comments ? '<tr><td colspan="2" style="color:#999999;font-size:13px;padding:10px 0 0 0;border-top:1px solid #333;"><span style="display:block;margin-bottom:4px;">Message</span><span style="color:#D4D4D4;">' + lead.comments + '</span></td></tr>' : '') +
          '</table>' +
          '</td></tr>' +
          '</table>' +

          '</td></tr>' +

          // Footer
          '<tr><td style="background-color:#000000;padding:24px 30px;text-align:center;border-top:3px solid #FF5E15;">' +
          '<p style="color:#D4D4D4;font-size:14px;margin:0 0 8px 0;font-weight:600;">DDAN Hood Cleaning and Repair</p>' +
          '<p style="color:#999999;font-size:12px;margin:0 0 4px 0;">Mt. Juliet, TN &bull; Serving All of Middle Tennessee</p>' +
          '<p style="color:#666666;font-size:12px;margin:0 0 12px 0;">Licensed &bull; Bonded &bull; Insured &bull; NFPA 96 Compliant</p>' +
          '<a href="https://ddanhoodservices.com" style="color:#FF5E15;font-size:12px;text-decoration:none;">ddanhoodservices.com</a>' +
          '</td></tr>' +

          '</table></td></tr></table></body></html>';

        const custRes = await fetch('https://api.smtp2go.com/v3/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: SMTP_KEY,
            sender: 'DDAN Hood Services <service@ddanhoodservices.com>',
            to: [lead.email],
            subject: 'Thanks for contacting DDAN Hood Cleaning and Repair!',
            html_body: custHtml,
            text_body: 'Hi ' + lead.firstName + ',\n\nThanks for contacting DDAN Hood Cleaning and Repair! We received your request for ' + serviceDisplay + ' and will get back to you shortly.\n\nFor immediate help call (615) 881-6968 — we are available 24/7.\n\n— DDAN Hood Cleaning and Repair\nMt. Juliet, TN | Serving All of Middle Tennessee\nddanhoodservices.com'
          })
        });
        const custData = await custRes.json();
        debug.customerEmail = { status: custRes.status, response: custData };
      } catch (e) {
        debug.customerEmail = { error: e.message };
      }
    }

    // 3. TEAM SMS via Twilio — new format
    try {
      var smsBody = '\uD83D\uDD25 New DDAN Inquiry!\nNeeds: ' + serviceDisplay +
        '\nName: ' + name +
        '\nAddress: ' + addressDisplay +
        '\nPhone: ' + lead.phone +
        '\nFlat Roof? ' + (lead.flatRoof || 'Not specified');

      if (lead.multipleLocations === 'Yes') {
        smsBody += '\n\u26A0\uFE0F Regarding Multiple Locations';
      }

      smsBody += '\n\nContact this customer: ' + lead.phone;

      const smsRes = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + env.TWILIO_ACCOUNT_SID + '/Messages.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(env.TWILIO_ACCOUNT_SID + ':' + env.TWILIO_AUTH_TOKEN)
        },
        body: new URLSearchParams({
          To: '+12289346002',
          From: env.TWILIO_PHONE_NUMBER,
          Body: smsBody
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

    // 5. GOOGLE SHEETS — updated columns: Date | Time | Source | First | Last | Phone | Email | Business Name | Street Address | City | Service | Part Needed | Multiple Locations | Flat Roof | Comments | Page URL
    try {
      if (!env.GOOGLE_SERVICE_ACCOUNT_JSON || !SHEET_ID) throw new Error('Sheets env vars not configured');
      const sa = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);

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

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt
      });
      const tokenData = await tokenRes.json();

      if (!tokenData.access_token) {
        throw new Error('No access token: ' + JSON.stringify(tokenData));
      }

      const sheetRes = await fetch(
        'https://sheets.googleapis.com/v4/spreadsheets/' + SHEET_ID + '/values/Website!A:P:append?valueInputOption=USER_ENTERED',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + tokenData.access_token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: [[
              lead.date, lead.time, lead.source, lead.firstName, lead.lastName,
              lead.phone, lead.email, lead.businessName, lead.businessStreetAddress,
              lead.businessCity, lead.service, lead.partNeeded,
              lead.multipleLocations, lead.flatRoof, lead.comments, lead.pageUrl
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

// --- PHONE FORMATTER ---
function formatPhone(phone) {
  var digits = phone.replace(/\D/g, '');
  if (digits.length > 10 && digits.charAt(0) === '1') digits = digits.substring(1);
  if (digits.length === 10) {
    return '(' + digits.substring(0, 3) + ') ' + digits.substring(3, 6) + '-' + digits.substring(6);
  }
  return phone;
}
