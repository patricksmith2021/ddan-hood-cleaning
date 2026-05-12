export async function onRequestPost(context) {
  const { env, request } = context;
  const { pin } = await request.json();

  if (pin === env.RECEIPTS_PIN) {
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ success: false }), {
    status: 401, headers: { 'Content-Type': 'application/json' }
  });
}
