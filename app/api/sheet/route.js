// app/api/sheet/route.js
import { google } from "googleapis";
import NodeCache from "node-cache";

// Cache serverless memory (TTL 5 menit)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/** ---------------- Helper agregasi ---------------- **/
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
    const jab = get(r, "Kategori Jabatan") || "Lainnya";
    const jenis = get(r, "Jenis Pengajuan") || "Lainnya";
    const dep = get(r, "Departemen Kustodian") || "Lainnya";
    const status = get(r, "Status Pengajuan") || "Unknown";
    const mcu = get(r, "Status MCU") || "Unknown";
    const print = get(r, "Print") || "Belum";
    const dateStr = get(r, "Local Submitted at");

    // gender per company
    if (!genderPerCompany[company]) genderPerCompany[company] = { Laki: 0, Perempuan: 0 };
    if (gender.toLowerCase().includes("laki")) genderPerCompany[company].Laki++;
    else genderPerCompany[company].Perempuan++;

    // kategori jabatan
    kategoriJabatan[jab] = (kategoriJabatan[jab] || 0) + 1;

    // perusahaan jumlah
    perusahaanJumlah[company] = (perusahaanJumlah[company] || 0) + 1;

    // status MCU
    statusMCU[mcu] = (statusMCU[mcu] || 0) + 1;

    // print
    statusPrint[print] = (statusPrint[print] || 0) + 1;

    // pengajuan & status per bulan
    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d)) {
        const month = d.toLocaleString("id-ID", { month: "long", year: "numeric" });
        jenisPengajuanPerBulan[month] = jenisPengajuanPerBulan[month] || {};
        jenisPengajuanPerBulan[month][jenis] = (jenisPengajuanPerBulan[month][jenis] || 0) + 1;

        statusPengajuanPerBulan[month] = statusPengajuanPerBulan[month] || {};
        statusPengajuanPerBulan[month][status] = (statusPengajuanPerBulan[month][status] || 0) + 1;
      }
    }

    // dep kustodian
    depKustodian[dep] = (depKustodian[dep] || 0) + 1;
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

/** ---------------- Fetch ke Google Sheets ---------------- **/
async function fetchSheetData() {
  const serviceAccountBase64 = process.env.GOOGLE_SERVICE_ACCOUNT;
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const range = process.env.SHEET_RANGE || "Clean Database!A1:V2000";

  if (!serviceAccountBase64 || !spreadsheetId) {
    throw new Error("Missing GOOGLE_SERVICE_ACCOUNT or SPREADSHEET_ID env");
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
  return resp.data.values || [];
}

/** ---------------- GET: baca data dari cache atau Google Sheets ---------------- **/
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const chart = searchParams.get("chart");
    const cacheKey = chart === "raw" ? "sheet_raw" : "sheet_agg";

    // cek cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return new Response(JSON.stringify(cached), {
        headers: { "Content-Type": "application/json", "Cache-Control": "s-maxage=300" },
      });
    }

    const values = await fetchSheetData();
    if (!values.length)
      return new Response(JSON.stringify({ headers: [], rows: [] }), {
        headers: { "Content-Type": "application/json" },
      });

    const headers = values[0];
    const rows = values.slice(1);

    // jika user minta raw data
    if (chart === "raw") {
      const raw = { headers, rows };
      cache.set(cacheKey, raw);
      return new Response(JSON.stringify(raw), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // data agregasi
    const agg = { ...aggregateData(rows, headers), headers, rows };
    cache.set(cacheKey, agg);
    return new Response(JSON.stringify(agg), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ERR /api/sheet:", err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/** ---------------- DELETE: invalidasi cache manual ---------------- **/
export async function DELETE() {
  cache.flushAll();
  return new Response(JSON.stringify({ message: "Cache cleared" }), {
    headers: { "Content-Type": "application/json" },
  });
}
