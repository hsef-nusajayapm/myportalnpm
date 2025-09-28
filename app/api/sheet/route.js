// app/api/sheet/route.js
import { google } from "googleapis";

export async function GET() {
  try {
    // ambil env
    const serviceAccountBase64 = process.env.GOOGLE_SERVICE_ACCOUNT;
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const range = process.env.SHEET_RANGE || "Clean Database!A1:V2000";

    if (!serviceAccountBase64 || !spreadsheetId) {
      return new Response(
        JSON.stringify({ error: "Missing service account or spreadsheet ID" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // decode base64 → object JSON
    const serviceAccountJson = JSON.parse(
      Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
    );

    // pastikan private_key punya newline
    serviceAccountJson.private_key = serviceAccountJson.private_key.replace(
      /\\n/g,
      "\n"
    );

    // auth
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountJson,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    // get values
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

    // header + rows
    const headers = values[0].map((h, i) => (h ? String(h).trim() : `col_${i}`));
    const rows = values.slice(1).map((r) => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = r[i] ?? "";
      });
      return obj;
    });

    const headersOut = {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    };

    return new Response(JSON.stringify({ headers, rows, raw: values }), {
      headers: headersOut,
    });
  } catch (err) {
    console.error("ERR /api/sheet:", err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
