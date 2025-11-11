"use client";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts";

export function AppBarChart({ data }) {
  const colors = [
    "oklch(0.55 0.22 263)",
    "oklch(0.51 0.23 277)",
    "oklch(0.54 0.25 293)",
    "oklch(0.56 0.25 302)",
    "oklch(0.59 0.26 323)",
    "oklch(0.59 0.22 1)",
  ];

  const filteredData = (() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    // mapping nama bulan Indo ke angka agar bisa diurutkan
    const bulanMap = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      Mei: 5,
      Jun: 6,
      Jul: 7,
      Agu: 8,
      Sep: 9,
      Okt: 10,
      Nov: 11,
      Des: 12,
    };

    // urutkan berdasarkan bulan
    const ordered = [...data].sort((a, b) => {
      const aNum = bulanMap[a.bulan?.slice(0, 3)] || 0;
      const bNum = bulanMap[b.bulan?.slice(0, 3)] || 0;
      return aNum - bNum;
    });

    // ambil 3 terakhir
    return ordered.slice(-3);
  })();

  const chartConfig = {
    colors,
  };

  return (
    <Card className="aspect-video gap-3 rounded-lg">
      <CardHeader>
        <CardDescription>Total Data Pengajuan</CardDescription>
      </CardHeader>
      <CardContent className="h-full w-full px-4 pt-0">
        <ChartContainer
          config={chartConfig}
          className="flex h-full w-full items-center justify-center"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              accessibilityLayer
              data={filteredData}
              margin={{ top: 20, left: 5, right: 5, bottom: 10 }}
              barCategoryGap="18%" // lebih rapat antar bar
              barGap={2} // jarak antar batang dalam satu kategori
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="bulan"
                height={12}
                tickMargin={6}
                axisLine={true}
                tickLine={false}
                tick={{ fontSize: 12, dy: -6 }}
                tickFormatter={(v) => String(v).slice(0, 3)}
              />
              <YAxis
                scale="log"
                domain={[1, "dataMax"]}
                allowDecimals={false}
                tick={false}
                axisLine={true}
                tickLine={false}
                width={0}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="oklch(70.2% 0.183 293.541)" radius={[6, 6, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
                <LabelList
                  dataKey="total"
                  position="top"
                  className="fill-foreground text-black"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
