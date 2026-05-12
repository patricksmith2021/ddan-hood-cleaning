export async function onRequestPost(context) {
  const { env, request } = context;
  const body = await request.json();
  const { id } = body;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing receipt ID' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const data = await env.RECEIPTS_KV.get(`receipt:${id}`);
  if (!data) {
    return new Response(JSON.stringify({ error: 'Receipt not found' }), {
      status: 404, headers: { 'Content-Type': 'application/json' }
    });
  }

  const receipt = JSON.parse(data);
  const errors = [];

  // Format phone
  const digits = receipt.businessPhone.replace(/\D/g, '');
  const toPhone = digits.length === 11 && digits[0] === '1' ? `+${digits}` : `+1${digits}`;

  // Format date
  const serviceDate = new Date(receipt.dateOfService).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // --- SMS via Twilio ---
  try {
    const twilioAuth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
    const smsBody = [
      'DDAN Hood Services — Service Receipt',
      '',
      `Service: ${receipt.service}`,
      `Date: ${serviceDate}`,
      receipt.details ? `Details: ${receipt.details}` : null,
      '',
      'Thank you for choosing DDAN Hood Services.',
      'Questions? Call (615) 881-6968',
      `View receipt: https://ddanhoodservices.com/receipts/?id=${id}`
    ].filter(Boolean).join('\n');

    const smsRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${twilioAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: toPhone,
          From: env.TWILIO_PHONE_NUMBER,
          Body: smsBody
        })
      }
    );
    if (!smsRes.ok) {
      const errBody = await smsRes.text();
      errors.push(`SMS failed (${smsRes.status}): ${errBody}`);
    }
  } catch (e) {
    errors.push(`SMS error: ${e.message}`);
  }

  // --- Email via SMTP2GO (only if customer email provided) ---
  if (receipt.customerEmail) {
    try {
      const emailHtml = `
<div style="background:#1A1A1A;padding:20px;font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="text-align:center;padding:20px 0;">
    <img src="https://ddanhoodservices.com/images/homepage/ddan-og-image.webp" alt="DDAN Hood Services" style="max-width:200px;height:auto;" />
  </div>
  <div style="background:#FF5E15;padding:16px 20px;">
    <span style="color:#FFF;font-size:18px;font-weight:bold;letter-spacing:1px;">SERVICE RECEIPT</span>
  </div>
  <div style="background:#111;padding:24px 20px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr style="border-bottom:1px solid #333;">
        <td style="color:#999;font-size:13px;padding:12px 0;text-transform:uppercase;width:130px;">SERVICE</td>
        <td style="color:#FF5E15;font-size:15px;padding:12px 0;">${receipt.service}</td>
      </tr>
      <tr style="border-bottom:1px solid #333;">
        <td style="color:#999;font-size:13px;padding:12px 0;text-transform:uppercase;">DATE</td>
        <td style="color:#FFF;font-size:15px;padding:12px 0;">${serviceDate}</td>
      </tr>
      <tr style="border-bottom:1px solid #333;">
        <td style="color:#999;font-size:13px;padding:12px 0;text-transform:uppercase;">BUSINESS</td>
        <td style="color:#FFF;font-size:15px;padding:12px 0;">${receipt.businessName}</td>
      </tr>
      <tr style="border-bottom:1px solid #333;">
        <td style="color:#999;font-size:13px;padding:12px 0;text-transform:uppercase;">ADDRESS</td>
        <td style="color:#FFF;font-size:15px;padding:12px 0;">${receipt.businessAddress}</td>
      </tr>
      ${receipt.details ? `<tr><td style="color:#999;font-size:13px;padding:12px 0;text-transform:uppercase;vertical-align:top;">DETAILS</td><td style="color:#FFF;font-size:15px;padding:12px 0;">${receipt.details}</td></tr>` : ''}
    </table>
    <div style="margin-top:24px;padding-top:16px;border-top:1px solid #333;text-align:center;">
      <p style="color:#D4D4D4;font-size:14px;margin:0;">DDAN Hood Services</p>
      <p style="color:#FF5E15;font-size:14px;margin:4px 0 0;">(615) 881-6968 &bull; service@ddanhoodservices.com</p>
      <p style="color:#666;font-size:12px;margin:8px 0 0;">Licensed, Bonded &amp; Insured &bull; NFPA 96 Compliant &bull; Est. 2006</p>
    </div>
  </div>
</div>`;

      const emailRes = await fetch('https://api.smtp2go.com/v3/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': env.SMTP2GO_API_KEY
        },
        body: JSON.stringify({
          sender: 'DDAN Hood Services <service@ddanhoodservices.com>',
          to: [receipt.customerEmail],
          subject: `DDAN Hood Services — Service Receipt (${serviceDate})`,
          html_body: emailHtml
        })
      });
      if (!emailRes.ok) {
        const errBody = await emailRes.text();
        errors.push(`Email failed (${emailRes.status}): ${errBody}`);
      }
    } catch (e) {
      errors.push(`Email error: ${e.message}`);
    }
  }

  // Update receipt status
  receipt.status = 'sent';
  receipt.sentAt = new Date().toISOString();
  await env.RECEIPTS_KV.put(`receipt:${id}`, JSON.stringify(receipt), { expirationTtl: 31536000 });

  return new Response(JSON.stringify({
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    receipt
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
