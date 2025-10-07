// app/api/sheet/route.js
import { google } from "googleapis";

// helper fungsi untuk agregasi
function aggregateData(rows, headers) {
  const get = (row, col) => row[headers.indexOf(col)] || "";

  // ---- 1. Jumlah Jenis Kelamin per Perusahaan ----
  const genderPerCompany = {};
  rows.forEach((r) => {
    const company = get(r, "Perusahaan") || get(r, "Perusahaan Lainnya") || "Lainnya";
    const gender = get(r, "Jenis Kelamin") || "Tidak Diketahui";
    if (!genderPerCompany[company]) genderPerCompany[company] = { Laki: 0, Perempuan: 0 };
    if (gender.toLowerCase().includes("laki")) genderPerCompany[company].Laki++;
    else genderPerCompany[company].Perempuan++;
  });

  // ---- 2. Jumlah Kategori Jabatan ----
  const kategoriJabatan = {};
  rows.forEach((r) => {
    const jab = get(r, "Kategori Jabatan") || "Lainnya";
    kategoriJabatan[jab] = (kategoriJabatan[jab] || 0) + 1;
  });

  // ---- 3. Jumlah Jenis Pengajuan per Bulan ----
  const jenisPengajuanPerBulan = {};
  rows.forEach((r) => {
    const jenis = get(r, "Jenis Pengajuan") || "Lainnya";
    const dateStr = get(r, "Local Submitted at");
    if (!dateStr) return;
    const d = new Date(dateStr);
    if (isNaN(d)) return;
    const month = d.toLocaleString("id-ID", { month: "long", year: "numeric" });
    if (!jenisPengajuanPerBulan[month]) jenisPengajuanPerBulan[month] = {};
    jenisPengajuanPerBulan[month][jenis] = (jenisPengajuanPerBulan[month][jenis] || 0) + 1;
  });

  // ---- 4. Jumlah Departemen Kustodian ----
  const depKustodian = {};
  rows.forEach((r) => {
    const dep = get(r, "Departemen Kustodian") || "Lainnya";
    depKustodian[dep] = (depKustodian[dep] || 0) + 1;
  });

  // ---- 5. Jumlah Status Pengajuan per Bulan ----
  const statusPengajuanPerBulan = {};
  rows.forEach((r) => {
    const status = get(r, "Status Pengajuan") || "Unknown";
    const dateStr = get(r, "Local Submitted at");
    if (!dateStr) return;
    const d = new Date(dateStr);
    if (isNaN(d)) return;
    const month = d.toLocaleString("id-ID", { month: "long", year: "numeric" });
    if (!statusPengajuanPerBulan[month]) statusPengajuanPerBulan[month] = {};
    statusPengajuanPerBulan[month][status] = (statusPengajuanPerBulan[month][status] || 0) + 1;
  });

  // ---- 6. Jumlah Perusahaan ----
  const perusahaanJumlah = {};
  rows.forEach((r) => {
    const company = get(r, "Perusahaan") || get(r, "Perusahaan Lainnya") || "Lainnya";
    perusahaanJumlah[company] = (perusahaanJumlah[company] || 0) + 1;
  });

  // ---- 7. Status MCU ----
  const statusMCU = {};
  rows.forEach((r) => {
    const status = get(r, "Status MCU") || "Unknown";
    statusMCU[status] = (statusMCU[status] || 0) + 1;
  });

  // ---- 8. Print ----
  const statusPrint = {};
  rows.forEach((r) => {
    const print = get(r, "Print") || "Belum";
    statusPrint[print] = (statusPrint[print] || 0) + 1;
  });

  // ---- 9. Total Karyawan ----
  const totalKaryawan = rows.length;

  // ---- 10. Total Print (yang sudah print) ----
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
    const chart = searchParams.get("chart"); // chart=raw atau chart=1..8

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

    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = resp.data.values || [];
    if (values.length === 0) {
      return new Response(JSON.stringify({ headers: [], rows: [], raw: [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const headers = values[0];
    const rows = values.slice(1);

    // jika user minta raw
    if (chart === "raw") {
      return new Response(JSON.stringify({ headers, rows, raw: { headers, rows } }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // hitung agregasi
    // hitung agregasi
    const result = aggregateData(rows, headers);

    // sertakan data mentah juga biar frontend bisa pakai
    return new Response(JSON.stringify({ ...result, headers, rows, raw: { headers, rows } }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
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
