// app/api/sheet/route.js
import { google } from "googleapis";
import NodeCache from "node-cache";

// Cache di memory serverless (TTL 5 menit)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// ---- Helper fungsi agregasi ----
function aggregateData(rows, headers) {
  const get = (row, col) => row[headers.indexOf(col)] || "";

  const genderPerCompany = {};
  const kategoriJabatan = {};
  const jenisPengajuanPerBulan = {};
  const depKustodian = {};
  const statusPengajuanPerBulan = {};
  const perusahaanJumlah = {};
  const statusMCU = {};
  const statusPrint = {};

  rows.forEach((r) => {
    const company = get(r, "Perusahaan") || get(r, "Perusahaan Lainnya") || "Lainnya";
    const gender = get(r, "Jenis Kelamin") || "Tidak Diketahui";
    if (!genderPerCompany[company]) genderPerCompany[company] = { Laki: 0, Perempuan: 0 };
    if (gender.toLowerCase().includes("laki")) genderPerCompany[company].Laki++;
    else genderPerCompany[company].Perempuan++;

    const jab = get(r, "Kategori Jabatan") || "Lainnya";
    kategoriJabatan[jab] = (kategoriJabatan[jab] || 0) + 1;

    const jenis = get(r, "Jenis Pengajuan") || "Lainnya";
    const dateStr = get(r, "Local Submitted at");
    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d)) {
        const month = d.toLocaleString("id-ID", { month: "long", year: "numeric" });
        if (!jenisPengajuanPerBulan[month]) jenisPengajuanPerBulan[month] = {};
        jenisPengajuanPerBulan[month][jenis] = (jenisPengajuanPerBulan[month][jenis] || 0) + 1;

        const status = get(r, "Status Pengajuan") || "Unknown";
        if (!statusPengajuanPerBulan[month]) statusPengajuanPerBulan[month] = {};
        statusPengajuanPerBulan[month][status] = (statusPengajuanPerBulan[month][status] || 0) + 1;
      }
    }

    const dep = get(r, "Departemen Kustodian") || "Lainnya";
    depKustodian[dep] = (depKustodian[dep] || 0) + 1;

    perusahaanJumlah[company] = (perusahaanJumlah[company] || 0) + 1;

    const statusM = get(r, "Status MCU") || "Unknown";
    statusMCU[statusM] = (statusMCU[statusM] || 0) + 1;

    const print = get(r, "Print") || "Belum";
    statusPrint[print] = (statusPrint[print] || 0) + 1;
  });

  const totalKaryawan = rows.length;
  const totalPrint = rows.filter((r) => (get(r, "Print") || "").toLowerCase() === "sudah").length;

  return {
    genderPerCompany,
    kategoriJabatan,
    jenisPengajuanPerBulan,
    depKustodian,
    statusPengajuanPerBulan,
    perusahaanJumlah,
    statusMCU,
    statusPrint,
    totalKaryawan,
    totalPrint,
  };
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const chart = searchParams.get("chart") || "default";

    // 🔹 Cek cache dulu
    const cacheKey = `sheet_${chart}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return new Response(JSON.stringify(cached), {
        headers: {
          "Content-Type": "application/json",
          "X-Cache": "HIT",
        },
      });
    }

    // 🔹 Ambil dari Google Sheets
    const serviceAccountBase64 = process.env.GOOGLE_SERVICE_ACCOUNT;
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = process.env.SHEET_RANGE || "Clean Database!A1:V2000";

    if (!serviceAccountBase64 || !spreadsheetId) {
      return new Response(JSON.stringify({ error: "Missing service account or spreadsheet ID" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const serviceAccountJson = JSON.parse(
      Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
    );
    serviceAccountJson.private_key = serviceAccountJson.private_key.replace(/\\n/g, "\n");

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountJson,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const resp = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const values = resp.data.values || [];
    if (values.length === 0) {
      return new Response(JSON.stringify({ headers: [], rows: [], raw: [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const headers = values[0];
    const rows = values.slice(1);
    const rawData = { headers, rows };

    let result =
      chart === "raw"
        ? { headers, rows, raw: rawData }
        : { ...aggregateData(rows, headers), headers, rows, raw: rawData };

    // 🔹 Simpan ke cache (TTL 5 menit)
    cache.set(cacheKey, result);

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Cache": "MISS",
      },
    });
  } catch (err) {
    console.error("ERR /api/sheet:", err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
