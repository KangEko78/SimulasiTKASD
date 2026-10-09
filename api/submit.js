export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Gunakan POST.' });
  }

  const endpoint = process.env.APPS_SCRIPT_URL;
  const secret = process.env.API_SECRET;
  if (!endpoint || !secret) {
    return res.status(500).json({ ok: false, error: 'Konfigurasi API belum lengkap.' });
  }

  const input = req.body;
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return res.status(400).json({ ok: false, error: 'Data hasil tidak valid.' });
  }

  const body = {
    token: secret,
    mapel: input.mapel,
    nama: input.nama,
    kelas: input.kelas,
    benar: input.benar,
    total: input.total,
    tidakDijawab: input.tidakDijawab,
    durasiDetik: input.durasiDetik,
    jawaban: input.jawaban,
    raguRagu: input.raguRagu
  };

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'follow'
    });
    const text = await upstream.text();
    let result;
    try { result = JSON.parse(text); }
    catch (_) { throw new Error('Respons Apps Script bukan JSON. Periksa URL deployment dan izin Web App.'); }
    if (!upstream.ok || !result.ok) {
      return res.status(502).json({ ok: false, error: result.error || 'Apps Script menolak penyimpanan.' });
    }
    return res.status(200).json({ ok: true, mapel: result.mapel });
  } catch (error) {
    return res.status(502).json({ ok: false, error: error.message || 'Gagal menghubungi Apps Script.' });
  }
}
