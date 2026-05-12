export async function onRequestPost(context) {
  const { env, request } = context;
  const body = await request.json();

  const required = ['contactName', 'businessName', 'businessAddress', 'businessPhone', 'service', 'dateOfService'];
  for (const field of required) {
    if (!body[field]) {
      return new Response(JSON.stringify({ error: `Missing: ${field}` }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

  const receipt = {
    id,
    contactName: body.contactName,
    businessName: body.businessName,
    businessAddress: body.businessAddress,
    businessPhone: body.businessPhone,
    customerEmail: body.customerEmail || '',
    service: body.service,
    details: body.details || '',
    dateOfService: body.dateOfService,
    createdAt: new Date().toISOString(),
    status: 'draft',
    sentAt: null
  };

  await env.RECEIPTS_KV.put(`receipt:${id}`, JSON.stringify(receipt), { expirationTtl: 31536000 });

  return new Response(JSON.stringify({ success: true, id, receipt }), {
    status: 201, headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

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

  return new Response(data, { headers: { 'Content-Type': 'application/json' } });
}
