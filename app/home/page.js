"use client";
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import Sidebar from "../../components/layouts/sidebar";
import Navbar from "../../components/layouts/Navbar";
import Footer from "../../components/layouts/Footer";
import styles from "./page.module.css";
import Script from "next/script";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// shadcn
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function HomePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);

  const [selectedTahun, setSelectedTahun] = useState("");
  const [selectedPerusahaan, setSelectedPerusahaan] = useState("");

  // nama bulan Indonesia
  const namaBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // panggil tally embed jika menu berubah
  useEffect(() => {
    if (activeMenu === "formPortal" && typeof window !== "undefined") {
      if (window.Tally && typeof window.Tally.loadEmbeds === "function") {
        window.Tally.loadEmbeds();
      }
    }
  }, [activeMenu]);

  // ambil data dari API
  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const res = await fetch("/api/sheet");
        const json = await res.json();
        if (json.rows) {
          setHeaders(json.headers || []);
          setRows(json.rows || []);
        } else {
          console.error("Invalid sheet payload", json);
        }
      } catch (err) {
        console.error("Fetch /api/sheet error", err);
      }
    };
    fetchSheet();
  }, []);

  // list tahun unik
  const tahunList = [
    ...new Set(
      rows
        .map((r) => {
          const d = new Date(r["Local Submitted at"]);
          return isNaN(d) ? null : d.getFullYear();
        })
        .filter(Boolean)
    ),
  ];

  // list perusahaan unik
  const perusahaanList = [
    ...new Set(
      rows
        .map((r) => r["Perusahaan"]?.trim()) // hilangkan spasi awal/akhir
        .filter(Boolean)
        .map((p) => p.toUpperCase()) // opsional: samakan huruf besar
    ),
  ];

  // filter data berdasar dropdown
  const filtered = rows.filter((r) => {
    const perusahaanOk = !selectedPerusahaan || r["Perusahaan"] === selectedPerusahaan;
    const tahunOk =
      !selectedTahun || new Date(r["Local Submitted at"]).getFullYear() === Number(selectedTahun);
    return perusahaanOk && tahunOk;
  });

  // agregasi per bulan tanpa tahun
  const monthMap = {}; // key = bulanIndex 0–11
  filtered.forEach((r) => {
    const tgl = new Date(r["Local Submitted at"]);
    if (isNaN(tgl)) return;
    const bulan = tgl.getMonth(); // 0–11
    monthMap[bulan] = (monthMap[bulan] || 0) + 1;
  });

  const labels = Object.keys(monthMap)
    .map((i) => namaBulan[i])
    .filter(Boolean);
  const values = Object.keys(monthMap).map((i) => monthMap[i]);

  const dataBar = {
    labels,
    datasets: [
      {
        label: "Jumlah Orang",
        data: values,
        backgroundColor: "rgba(37,99,235,0.6)",
      },
    ],
  };

  const optionsBar = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Bulan" } },
      y: {
        title: { display: true, text: "Jumlah Orang" },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex flex-grow">
      <Sidebar
        styles={styles}
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      {/* <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
              <div className="bg-muted/50 aspect-video rounded-xl" />
            </div>
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
          </div>
        </SidebarInset>
      </SidebarProvider> */}
      <div className="flex flex-grow flex-col transition-all duration-500">
        <Navbar toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
        <main className="flex-grow bg-gray-100 p-4">
          {activeMenu === "dashboard" && (
            <Card className="min-h-screen rounded bg-white p-4 shadow">
              <CardHeader>
                <CardTitle>📊 Grafik Dashboard</CardTitle>
              </CardHeader>
              {/* <CardContent>
                <div className="flex flex-wrap gap-4 mb-4">
                  <select
                    className="border p-2 rounded"
                    value={selectedTahun}
                    onChange={(e) => setSelectedTahun(e.target.value)}
                  >
                    <option value="">Semua Tahun</option>
                    {tahunList.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>

                  <select
                    className="border p-2 rounded"
                    value={selectedPerusahaan}
                    onChange={(e) => setSelectedPerusahaan(e.target.value)}
                  >
                    <option value="">Semua Perusahaan</option>
                    {perusahaanList.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {labels.length ? (
                  <div style={{ width: "100%", maxWidth: 900 }}>
                    <Bar data={dataBar} options={optionsBar} />
                  </div>
                ) : (
                  <p>Loading data…</p>
                )}
              </CardContent> */}
            </Card>
          )}

          {activeMenu === "formPortal" && (
            <div className="min-h-screen rounded bg-white p-4 shadow">
              <div className="container mx-auto max-w-3xl">
                <iframe
                  data-tally-src="https://tally.so/embed/mOqMG7?alignLeft=1&transparentBackground=1&dynamicHeight=1"
                  loading="lazy"
                  width="100%"
                  height="1920"
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                  title="PORTAL NPM"
                ></iframe>
              </div>
              <Script
                id="tally-js"
                src="https://tally.so/widgets/embed.js"
                onLoad={() => {
                  Tally.loadEmbeds();
                }}
              />
            </div>
          )}

          {activeMenu === "formCommissioning" && (
            <div className="min-h-screen rounded bg-white p-4 shadow">Form Commissioning</div>
          )}
          {activeMenu === "formEscort" && (
            <div className="min-h-screen rounded bg-white p-4 shadow">Form Escort</div>
          )}
          {activeMenu === "visitor" && (
            <div className="min-h-screen rounded bg-white p-4 shadow">Visitor</div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
