"use client";

import { useMemo } from "react";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/** ---------------- Parse / Format Tanggal ---------------- **/
function parseDateFlexible(str) {
  if (!str) return null;
  if (str instanceof Date) return str;
  if (typeof str !== "string") return null;

  const datePart = (str || "").split(" ")[0].trim();
  const parts = datePart
    .split(/[\/\-.]/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 3) {
    if (parts[0].length === 4) {
      const y = Number(parts[0]),
        m = Number(parts[1]) - 1,
        d = Number(parts[2]);
      const dt = new Date(y, m, d);
      return isNaN(dt) ? null : dt;
    }

    const month = Number(parts[0]),
      day = Number(parts[1]),
      year = Number(parts[2]);
    if ([month, day, year].some((n) => !Number.isFinite(n))) return null;
    const dt = new Date(year, month - 1, day);
    return isNaN(dt) ? null : dt;
  }

  const fallback = new Date(str);
  return isNaN(fallback) ? null : fallback;
}

function formatDate(value) {
  const d = parseDateFlexible(value);
  if (!d) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/** ---------------- Ambil field fleksibel ---------------- **/
function getField(obj = {}, candidates = []) {
  for (const k of candidates) {
    if (!k) continue;
    if (
      Object.prototype.hasOwnProperty.call(obj, k) &&
      obj[k] !== undefined &&
      obj[k] !== null &&
      String(obj[k]).trim() !== ""
    ) {
      return String(obj[k]).trim();
    }
  }
  return null;
}

/** ---------------- Komponen utama ---------------- **/
export function AppTable({ data }) {
  // pakai SWR Mutation agar tombol bisa revalidate manual
  const { trigger, isMutating } = useSWRMutation("refresh-data", async () => {
    await Promise.all([mutate("/api/sheet"), mutate("/api/sheet?chart=raw")]);
  });

  const normalizedRows = useMemo(() => {
    if (!data) return [];
    const headers = (data.raw?.headers || data.headers || []).map((h) =>
      typeof h === "string" ? h.trim() : String(h)
    );

    const rowsArr = data.raw?.rows || data.rows || [];
    if (!rowsArr || rowsArr.length === 0) return [];

    const rows = rowsArr.map((r) => {
      if (Array.isArray(r)) {
        if (headers.length) {
          const obj = {};
          headers.forEach((h, i) => {
            obj[h] = r[i] ?? "";
          });
          return obj;
        }
        const obj = {};
        r.forEach((v, i) => {
          obj[`c${i}`] = v ?? "";
        });
        return obj;
      } else if (r && typeof r === "object") {
        const obj = {};
        Object.keys(r).forEach((k) => {
          const kk = typeof k === "string" ? k.trim() : String(k);
          obj[kk] = r[k];
        });
        return obj;
      } else {
        return {};
      }
    });

    return rows;
  }, [data]);

  const rowsFiltered = useMemo(() => {
    if (!normalizedRows || normalizedRows.length === 0) return [];

    const sorted = [...normalizedRows].sort((a, b) => {
      const aDate =
        parseDateFlexible(
          getField(a, ["Local Submitted at", "Local Submitted At", "LocalSubmittedAt", "R"])
        )?.getTime() || 0;
      const bDate =
        parseDateFlexible(
          getField(b, ["Local Submitted at", "Local Submitted At", "LocalSubmittedAt", "R"])
        )?.getTime() || 0;
      return bDate - aDate;
    });

    return sorted.slice(0, 20);
  }, [normalizedRows]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base md:text-lg">Data Pengajuan Terbaru</CardTitle>

        {/* Tombol Refresh dengan efek tekan dan spinner */}
        <button
          onClick={trigger}
          disabled={isMutating}
          className={`flex items-center gap-2 rounded-md px-3 py-1 text-xs font-medium text-white transition active:scale-95 md:text-sm ${
            isMutating
              ? "cursor-not-allowed bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {isMutating ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Refreshing...
            </>
          ) : (
            "Refresh Data"
          )}
        </button>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <div className="min-w-[700px] md:min-w-full">
          <Table className="text-xs md:text-sm">
            <TableHeader className="bg-muted/40 border-b">
              <TableRow className="h-10">
                <TableHead className="w-[40px] text-left md:w-[60px]">No.</TableHead>
                <TableHead className="text-left whitespace-nowrap">Tanggal</TableHead>
                <TableHead className="text-left whitespace-nowrap">Nama</TableHead>
                <TableHead className="text-left whitespace-nowrap">Jabatan</TableHead>
                <TableHead className="text-left whitespace-nowrap">Perusahaan</TableHead>
                <TableHead className="text-left whitespace-nowrap">Jenis Pengajuan</TableHead>
                <TableHead className="text-left whitespace-nowrap">Status Pengajuan</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rowsFiltered.length > 0 ? (
                rowsFiltered.map((row, idx) => {
                  const namaFull = getField(row, ["Nama Lengkap", "Nama", "Full Name", "FullName"]);
                  const namaDepan = getField(row, ["Nama Depan", "First Name", "FirstName"]);
                  const namaBelakang = getField(row, ["Nama Belakang", "Last Name", "LastName"]);
                  const nama =
                    namaFull ||
                    (namaDepan || namaBelakang
                      ? `${namaDepan || ""} ${namaBelakang || ""}`.trim()
                      : "-");

                  const jabatan = getField(row, ["Jabatan", "Job Title", "Position"]) || "-";
                  const perusahaan =
                    getField(row, [
                      "Perusahaan",
                      "Perusahaan Lainnya",
                      "Company",
                      "Company Name",
                    ]) || "-";
                  const jenisPengajuan = getField(row, ["Jenis Pengajuan", "Jenis"]) || "-";
                  const status = getField(row, ["Status Pengajuan", "Status"]) || "-";
                  const tanggal = formatDate(
                    getField(row, [
                      "Local Submitted at",
                      "Local Submitted At",
                      "LocalSubmittedAt",
                      "R",
                    ]) || ""
                  );

                  return (
                    <TableRow key={idx} className="hover:bg-muted/30 border-b transition-colors">
                      <TableCell className="p-2 md:p-3">{idx + 1}</TableCell>
                      <TableCell className="p-2 md:p-3">{tanggal}</TableCell>
                      <TableCell className="p-2 md:p-3">{nama}</TableCell>
                      <TableCell className="p-2 md:p-3">{jabatan}</TableCell>
                      <TableCell className="p-2 md:p-3">{perusahaan}</TableCell>
                      <TableCell className="p-2 md:p-3">{jenisPengajuan}</TableCell>
                      <TableCell className="p-2 md:p-3">{status}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground p-4 text-center">
                    Tidak ada data yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
