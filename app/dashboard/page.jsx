"use client";

import useSWR from "swr";
import { useMemo } from "react";
import { AppBarChart } from "@/components/AppBarChart";
import { CardSummaryTotal } from "@/components/CardSummaryTotal";
import { CardSummaryPrint } from "@/components/CardSummaryPrint";
import { AppTable } from "@/components/AppTable";

// Fungsi fetcher standar untuk SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  // --- Ambil data agregat dan raw ---
  const { data: aggData, error: aggError } = useSWR("/api/sheet", fetcher, {
    refreshInterval: 30000, // refresh setiap 30 detik
  });

  const { data: rawData, error: rawError } = useSWR("/api/sheet?chart=raw", fetcher, {
    refreshInterval: 60000, // refresh setiap 1 menit
  });

  // --- Hitung Total & Chart (pakai useMemo agar efisien) ---
  const totalKaryawan = useMemo(() => {
    if (!aggData) return 0;
    return Object.values(aggData.perusahaanJumlah || {}).reduce((a, b) => a + b, 0);
  }, [aggData]);

  const totalPrint = useMemo(() => {
    if (!aggData) return 0;
    return (
      (aggData.statusPrint &&
        (aggData.statusPrint["DONE"] || aggData.statusPrint["SUKSES"] || 0)) ||
      0
    );
  }, [aggData]);

  const chartData = useMemo(() => {
    if (!aggData) return [];
    return Object.entries(aggData.jenisPengajuanPerBulan || {}).map(([bulan, jenis]) => ({
      bulan,
      total: Object.values(jenis || {}).reduce((a, b) => a + b, 0),
    }));
  }, [aggData]);

  // --- Fungsi bantu tren ---
  const calcTrendValue = (arr) => {
    if (arr.length < 2) return 0;
    const last = arr[arr.length - 1];
    const prev = arr[arr.length - 2];
    if (prev === 0) return 0;
    return (last / prev) * 100;
  };

  const formatTrend = (val) => (Number.isInteger(val) ? val + "%" : val.toFixed(1) + "%");

  const pengajuanArr = chartData.map((item) => item.total);
  const trendPengajuanValue = calcTrendValue(pengajuanArr);
  const trendPengajuanLabel = formatTrend(trendPengajuanValue);

  const trendPrintValue = totalKaryawan > 0 ? (totalPrint / totalKaryawan) * 100 : 0;
  const trendPrintLabel = formatTrend(trendPrintValue);

  // --- Conditional Rendering (di akhir, setelah semua hooks) ---
  if (aggError || rawError)
    return <p className="p-10 text-center text-red-500">Gagal memuat data.</p>;
  if (!aggData || !rawData) return <p className="p-10 text-center">Loading...</p>;

  // --- Render utama ---
  return (
    <>
      <div className="grid auto-rows-fr gap-2 pt-2 md:grid-cols-3">
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
      <div className="bg-muted/50 flex min-h-screen max-w-full flex-1 justify-center rounded-xl md:min-h-min">
        <div className="flex max-w-full flex-1 flex-col justify-center">
          <AppTable data={rawData} />
        </div>
      </div>
    </>
  );
}
