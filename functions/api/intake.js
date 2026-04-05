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

    // Resolve env var names
    const SMTP_KEY = env.SMTP2GO_API_KEY || env.SMTP2GO_API || '';
    const SHEET_ID = env.GOOGLE_SHEET_ID || '';

    // Logo URL for emails
    const logoUrl = 'https://ddanhoodcleaning.com/images/logos/DDAN%20Hood%20Cleaning%20and%20Repair%20Logo%20Black%20BG.png';

    // 1. TEAM EMAIL via SMTP2GO
    try {
      const teamHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background-color:#111111;font-family:Arial,Helvetica,sans-serif;">' +
        '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#111111;padding:20px 0;">' +
        '<tr><td align="center">' +
        '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">' +

        // Header with logo
        '<tr><td style="background-color:#000000;padding:24px 30px;text-align:center;border-bottom:3px solid #FF5E15;">' +
        '<img src="' + logoUrl + '" alt="DDAN Hood Cleaning and Repair" width="220" style="max-width:220px;height:auto;" />' +
        '</td></tr>' +

        // Orange accent bar
        '<tr><td style="background-color:#FF5E15;padding:14px 30px;">' +
        '<span style="color:#FFFFFF;font-size:18px;font-weight:700;letter-spacing:0.5px;">NEW LEAD</span>' +
        '<span style="color:#FFFFFF;font-size:14px;float:right;padding-top:3px;">' + lead.date + ' &bull; ' + lead.time + ' CT</span>' +
        '</td></tr>' +

        // Lead details
        '<tr><td style="background-color:#1A1A1A;padding:30px;">' +

        // Name + Phone hero
        '<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">' +
        '<tr><td style="padding:16px 20px;background-color:#222222;border-left:4px solid #FF5E15;">' +
        '<div style="color:#FFFFFF;font-size:22px;font-weight:700;margin-bottom:6px;">' + name + '</div>' +
        '<a href="tel:' + lead.phone + '" style="color:#FF5E15;font-size:20px;font-weight:700;text-decoration:none;">' + lead.phone + '</a>' +
        '</td></tr>' +
        '</table>' +

        // Details table
        '<table width="100%" cellpadding="0" cellspacing="0">' +
        buildTeamRow('Service', lead.service, '#FF5E15') +
        buildTeamRow('Email', lead.email ? '<a href="mailto:' + lead.email + '" style="color:#FF5E15;text-decoration:none;">' + lead.email + '</a>' : 'Not provided', '#D4D4D4') +
        buildTeamRow('Business', lead.businessName || 'Not provided', '#D4D4D4') +
        buildTeamRow('Address', lead.businessAddress || 'Not provided', '#D4D4D4') +
        buildTeamRow('Multiple Locations', lead.multipleLocations, '#D4D4D4') +
        buildTeamRow('Flat Roof', lead.flatRoof, '#D4D4D4') +
        buildTeamRow('Comments', lead.comments || 'None', '#D4D4D4') +
        buildTeamRow('Source', lead.source, '#999999') +
        buildTeamRow('Page', '<a href="' + lead.pageUrl + '" style="color:#FF5E15;text-decoration:none;word-break:break-all;">' + lead.pageUrl + '</a>', '#D4D4D4') +
        '</table>' +

        // Quick action button
        '<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">' +
        '<tr><td align="center">' +
        '<a href="tel:' + lead.phone + '" style="display:inline-block;background-color:#FF5E15;color:#FFFFFF;font-size:16px;font-weight:700;padding:14px 40px;text-decoration:none;border-radius:4px;">Call ' + lead.firstName + ' Now</a>' +
        '</td></tr>' +
        '</table>' +

        '</td></tr>' +

        // Footer
        '<tr><td style="background-color:#000000;padding:16px 30px;text-align:center;border-top:1px solid #333333;">' +
        '<span style="color:#666666;font-size:12px;">DDAN Hood Cleaning and Repair &bull; Mt. Juliet, TN &bull; (615) 881-6968</span>' +
        '</td></tr>' +

        '</table></td></tr></table></body></html>';

      const emailRes = await fetch('https://api.smtp2go.com/v3/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: SMTP_KEY,
          sender: 'DDAN Online <online@ddanhoodcleaning.com>',
          to: ['patricksmith.phd@gmail.com'],
          subject: 'New Lead: ' + name + ' — ' + lead.service,
          html_body: teamHtml,
          text_body: 'New DDAN Lead\nName: ' + name + '\nPhone: ' + lead.phone + '\nEmail: ' + (lead.email || 'N/A') + '\nBusiness: ' + (lead.businessName || 'N/A') + '\nService: ' + lead.service + '\nTime: ' + lead.date + ' ' + lead.time + ' CT'
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

          // What to expect
          '<h2 style="color:#FFFFFF;font-size:18px;font-weight:600;margin:28px 0 16px 0;">What Happens Next</h2>' +

          '<table width="100%" cellpadding="0" cellspacing="0">' +
          buildStep('1', 'A team member will review your request') +
          buildStep('2', 'We\'ll call you to confirm details and schedule service') +
          buildStep('3', 'Our crew arrives on time — every time') +
          '</table>' +

          // Your request summary
          '<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">' +
          '<tr><td style="background-color:#222222;padding:20px;border-radius:4px;">' +
          '<h3 style="color:#FF5E15;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px 0;">Your Request</h3>' +
          '<table width="100%" cellpadding="0" cellspacing="0">' +
          '<tr><td style="color:#999999;font-size:13px;padding:4px 0;">Service:</td><td style="color:#FFFFFF;font-size:13px;padding:4px 0;text-align:right;">' + lead.service + '</td></tr>' +
          (lead.businessName ? '<tr><td style="color:#999999;font-size:13px;padding:4px 0;">Business:</td><td style="color:#FFFFFF;font-size:13px;padding:4px 0;text-align:right;">' + lead.businessName + '</td></tr>' : '') +
          '</table>' +
          '</td></tr>' +
          '</table>' +

          '</td></tr>' +

          // Footer
          '<tr><td style="background-color:#000000;padding:24px 30px;text-align:center;border-top:3px solid #FF5E15;">' +
          '<p style="color:#D4D4D4;font-size:14px;margin:0 0 8px 0;font-weight:600;">DDAN Hood Cleaning and Repair</p>' +
          '<p style="color:#999999;font-size:12px;margin:0 0 4px 0;">Mt. Juliet, TN &bull; Serving All of Middle Tennessee</p>' +
          '<p style="color:#666666;font-size:12px;margin:0 0 12px 0;">Licensed &bull; Bonded &bull; Insured &bull; NFPA 96 Compliant</p>' +
          '<a href="https://ddanhoodcleaning.com" style="color:#FF5E15;font-size:12px;text-decoration:none;">ddanhoodcleaning.com</a>' +
          '</td></tr>' +

          '</table></td></tr></table></body></html>';

        const custRes = await fetch('https://api.smtp2go.com/v3/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: SMTP_KEY,
            sender: 'DDAN Hood Services <service@ddanhoodcleaning.com>',
            to: [lead.email],
            subject: 'Thanks for contacting DDAN Hood Cleaning and Repair!',
            html_body: custHtml,
            text_body: 'Hi ' + lead.firstName + ',\n\nThanks for contacting DDAN Hood Cleaning and Repair! We received your request for ' + lead.service + ' and will get back to you shortly.\n\nFor immediate help call (615) 881-6968 — we are available 24/7.\n\n— DDAN Hood Cleaning and Repair\nMt. Juliet, TN | Serving All of Middle Tennessee\nddanhoodcleaning.com'
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
        'https://sheets.googleapis.com/v4/spreadsheets/' + SHEET_ID + '/values/Website!A:N:append?valueInputOption=USER_ENTERED',
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

// --- EMAIL TEMPLATE HELPERS ---
function buildTeamRow(label, value, valueColor) {
  return '<tr>' +
    '<td style="padding:10px 12px;color:#999999;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #333333;width:140px;vertical-align:top;">' + label + '</td>' +
    '<td style="padding:10px 12px;color:' + (valueColor || '#D4D4D4') + ';font-size:15px;border-bottom:1px solid #333333;">' + value + '</td>' +
    '</tr>';
}

function buildStep(num, text) {
  return '<tr><td style="padding:8px 0;">' +
    '<table cellpadding="0" cellspacing="0"><tr>' +
    '<td style="width:32px;vertical-align:top;">' +
    '<div style="width:28px;height:28px;background-color:#FF5E15;border-radius:50%;text-align:center;line-height:28px;color:#FFFFFF;font-size:14px;font-weight:700;">' + num + '</div>' +
    '</td>' +
    '<td style="padding-left:12px;color:#D4D4D4;font-size:15px;line-height:28px;">' + text + '</td>' +
    '</tr></table>' +
    '</td></tr>';
}
