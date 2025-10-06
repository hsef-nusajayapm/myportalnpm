"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, XCircle } from "lucide-react";

/** ---------- Parser / Formatter tanggal (fleksibel) ---------- **/
function parseDateFlexible(str) {
  if (!str) return null;
  if (str instanceof Date) return str;
  if (typeof str === "number") return new Date(str);
  if (typeof str !== "string") return null;

  // ISO / yyyy-mm-dd or contains T
  const isoLike = /^\d{4}-\d{2}-\d{2}/;
  if (str.includes("T") || isoLike.test(str)) {
    const d = new Date(str);
    return isNaN(d) ? null : d;
  }

  // pemisah bisa / - atau .
  const parts = str.split(/[\/\-.]/);
  if (parts.length === 3) {
    // kalau format: YYYY-MM-DD
    if (parts[0].length === 4) {
      const y = Number(parts[0]),
        m = Number(parts[1]) - 1,
        d = Number(parts[2]);
      return new Date(y, m, d);
    }

    // heuristik: kalau angka pertama > 12 kemungkinan day-first (DD/MM/YYYY)
    const a = Number(parts[0]),
      b = Number(parts[1]),
      c = Number(parts[2]);
    if (a > 12) {
      return new Date(c, b - 1, a); // c = year
    }
    // default asumsi month-first MM/DD/YYYY
    return new Date(c, a - 1, b);
  }

  // fallback ke Date parsing
  const fallback = new Date(str);
  return isNaN(fallback) ? null : fallback;
}

function formatDate(value) {
  const d = value instanceof Date ? value : parseDateFlexible(value);
  if (!d) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/** ---------- Component ---------- **/
export function AppTable({ data }) {
  const [dateRange, setDateRange] = useState(null);

  // expose parser ke `window` hanya di dev untuk testing console
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-undef
      window.parseDate = parseDateFlexible;
      window.formatDate = formatDate;
      return () => {
        // cleanup: hapus setelah unmount
        try {
          delete window.parseDate;
          delete window.formatDate;
        } catch {}
      };
    }
  }, []);

  // quick debug: structure dari data
  useEffect(() => {
    if (data) {
      // jangan spam console, ini hanya untuk debugging awal
      console.log("DEBUG: data.raw.rows length:", data?.raw?.rows?.length);
      console.log("DEBUG: sample rows:", data?.raw?.rows?.slice(0, 3));
    }
  }, [data]);

  const rowsFiltered = useMemo(() => {
    if (!data?.raw?.rows) return [];

    let rows = [...data.raw.rows];

    // if dateRange filtering requested
    if (dateRange?.from && dateRange?.to) {
      const from = new Date(dateRange.from);
      from.setHours(0, 0, 0, 0);
      const to = new Date(dateRange.to);
      to.setHours(23, 59, 59, 999);

      rows = rows.filter((row, idx) => {
        const rawVal = row[17]; // kolom R (index 17)
        const tgl = parseDateFlexible(rawVal);

        // in dev, warn rows with invalid date
        if (!tgl && process.env.NODE_ENV === "development") {
          console.warn(`Row[${idx}] invalid date at row[17]:`, rawVal);
        }
        return tgl && tgl >= from && tgl <= to;
      });
    }

    // sort desc by tanggal
    rows.sort((a, b) => {
      const ta = parseDateFlexible(a[17])?.getTime() || 0;
      const tb = parseDateFlexible(b[17])?.getTime() || 0;
      return tb - ta;
    });

    return rows.slice(0, 20);
  }, [data, dateRange]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <CardTitle>Daftar Pengajuan Terbaru</CardTitle>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {formatDate(dateRange.from)} – {formatDate(dateRange.to)}
                    </>
                  ) : (
                    formatDate(dateRange.from)
                  )
                ) : (
                  "Pilih rentang tanggal"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="range" selected={dateRange} onSelect={setDateRange} initialFocus />
            </PopoverContent>
          </Popover>

          {dateRange && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDateRange(null)}
              title="Reset filter"
            >
              <XCircle className="h-5 w-5 text-red-500" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Table className="w-full overflow-x-auto text-sm">
          <TableHeader className="border-b">
            <TableRow className="h-12">
              <TableHead className="w-[50px] p-2 text-left">No.</TableHead>
              <TableHead className="p-2 text-left">Tanggal</TableHead>
              <TableHead className="p-2 text-left">Nama</TableHead>
              <TableHead className="p-2 text-left">Perusahaan</TableHead>
              <TableHead className="p-2 text-left">Jabatan</TableHead>
              <TableHead className="p-2 text-left">Jenis Pengajuan</TableHead>
              <TableHead className="p-2 text-left">Status Pengajuan</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rowsFiltered?.map((row, idx) => {
              const perusahaan = row[5] || "";
              const perusahaanLain = row[6] || "";
              const perusahaanFinal = perusahaanLain
                ? `${perusahaan} (${perusahaanLain})`
                : perusahaan;
              return (
                <TableRow key={idx} className="hover:bg-muted/30 border-b">
                  <TableCell className="p-2">{idx + 1}</TableCell>
                  <TableCell className="p-2">{formatDate(row[17])}</TableCell>
                  <TableCell className="p-2">{row[1]}</TableCell>
                  <TableCell className="p-2">{perusahaanFinal}</TableCell>
                  <TableCell className="p-2">{row[9]}</TableCell>
                  <TableCell className="p-2">{row[11]}</TableCell>
                  <TableCell className="p-2">{row[12]}</TableCell>
                </TableRow>
              );
            })}

            {rowsFiltered?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground p-4 text-center">
                  Tidak ada data untuk filter ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
