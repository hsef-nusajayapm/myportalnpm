"use client";

import { useEffect, useState } from "react";
import { AppBarChart } from "@/components/AppBarChart";
import { CardSummaryTotal } from "@/components/CardSummaryTotal";
import { CardSummaryPrint } from "@/components/CardSummaryPrint";
import { AppTable } from "@/components/AppTable";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [totalKaryawan, setTotalKaryawan] = useState(0);
  const [totalPrint, setTotalPrint] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // 1) fetch agregasi (dipakai untuk cards)
      const res = await fetch("/api/sheet");
      const json = await res.json();
      setData(json);

      // --- Total Karyawan ---
      const karyawan = Object.values(json.perusahaanJumlah || {}).reduce((a, b) => a + b, 0);
      setTotalKaryawan(karyawan);

      // --- Total Print (DONE) ---
      const printDone =
        (json.statusPrint && (json.statusPrint["DONE"] || json.statusPrint["SUKSES"] || 0)) || 0;
      setTotalPrint(printDone);

      // --- Data untuk grafik pengajuan per bulan ---
      const perBulan = Object.entries(json.jenisPengajuanPerBulan || {}).map(([bulan, jenis]) => ({
        bulan,
        total: Object.values(jenis || {}).reduce((a, b) => a + b, 0),
      }));
      setChartData(perBulan);

      // 2) fetch RAW untuk tabel (headers + rows)
      try {
        const rawRes = await fetch("/api/sheet?chart=raw", { cache: "no-store" });
        const rawJson = await rawRes.json();
        // rawJson mungkin sudah berbentuk { headers, rows } atau { raw: { headers, rows } }
        const rawForTable = rawJson.raw
          ? { headers: rawJson.raw.headers, rows: rawJson.raw.rows }
          : { headers: rawJson.headers, rows: rawJson.rows };
        // pass rawForTable ke AppTable via setDataTable (atau reuse setData jika mau)
        setData(rawForTable); // jika kamu mau keep single state, tapi kalau cards memerlukan agregasi, gunakan state lain
        // Jika kamu butuh tetap menyimpan agregasi di `data`, dan raw di state lain:
        // setRawData(rawForTable);
      } catch (e) {
        console.warn("Gagal ambil raw sheet:", e);
      }
    }

    fetchData();
  }, []);
  // --- Helper ---
  const calcTrendValue = (arr) => {
    if (arr.length < 2) return 0;
    const last = arr[arr.length - 1];
    const prev = arr[arr.length - 2];
    if (prev === 0) return 0;
    return (last / prev) * 100;
  };

  const formatTrend = (val) => (Number.isInteger(val) ? val + "%" : val.toFixed(1) + "%");

  // --- Trend pengajuan ---
  const pengajuanArr = chartData.map((item) => item.total);
  const trendPengajuanValue = calcTrendValue(pengajuanArr);
  const trendPengajuanLabel = formatTrend(trendPengajuanValue);

  // --- Trend print = jumlah print dibanding total karyawan ---
  const trendPrintValue = totalKaryawan > 0 ? (totalPrint / totalKaryawan) * 100 : 0;
  const trendPrintLabel = formatTrend(trendPrintValue);

  if (!data) return <p className="p-10 text-center">Loading...</p>;

  return (
    <>
      <div className="grid auto-rows-fr gap-2 md:grid-cols-3">
        {/* Cards */}
        <CardSummaryTotal
          totalKaryawan={totalKaryawan}
          trendValue={trendPengajuanValue}
          trendLabel={trendPengajuanLabel}
        />
        <CardSummaryPrint
          totalPrint={totalPrint}
          trendValue={trendPrintValue}
          trendLabel={trendPrintLabel}
        />
        <AppBarChart data={chartData} />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        {/* Table (contoh sederhana) */}
        <AppTable data={data} />
      </div>
    </>
  );
}
