export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Gunakan GET.' });
  }
  const endpoint = process.env.APPS_SCRIPT_URL;
  const secret = process.env.API_SECRET;
  if (!endpoint || !secret) {
    return res.status(500).json({ ok: false, error: 'Konfigurasi API belum lengkap.' });
  }

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'dashboard', token: secret }),
      redirect: 'follow'
    });
    const text = await upstream.text();
    let result;
    try { result = JSON.parse(text); }
    catch (_) { throw new Error('Respons Apps Script bukan JSON. Periksa deployment Web App.'); }
    if (!upstream.ok || !result.ok) {
      return res.status(502).json({ ok: false, error: result.error || 'Gagal membaca ringkasan hasil.' });
    }
    // Apps Script returns aggregates only; names and raw answer strings stay in Sheets.
    return res.status(200).json({ ok: true, dashboard: result.dashboard });
  } catch (error) {
    return res.status(502).json({ ok: false, error: error.message || 'Gagal menghubungi Apps Script.' });
  }
}
