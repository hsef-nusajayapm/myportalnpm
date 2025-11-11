"use client";

import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IoMdTrendingDown, IoMdTrendingUp } from "react-icons/io";

export function CardSummaryTotal({ totalKaryawan, trendValue, trendLabel }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardDescription>Total Karyawan</CardDescription>
        <CardTitle className="text-5xl font-semibold tabular-nums @[250px]:text-6xl">
          {totalKaryawan}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {trendValue > 100 ? (
              <IoMdTrendingUp className="text-semibold text-green-600" />
            ) : trendValue < 100 ? (
              <IoMdTrendingDown className="text-semibold text-red-600" />
            ) : (
              "–"
            )}
            {trendLabel}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-md flex items-center gap-2">
          Trend % Pengajuan ID Card
          {trendValue > 100 ? (
            <IoMdTrendingUp className="size-4 text-green-600" />
          ) : trendValue < 100 ? (
            <IoMdTrendingDown className="size-4 text-red-600" />
          ) : (
            <span className="text-gray-500">–</span>
          )}
          <span className="text-foreground flex font-bold">{trendLabel}</span>
        </div>
        <div className="text-muted-foreground italic">
          Berdasarkan Jumlah Karyawan yang Terdata di PORTAL
        </div>
      </CardFooter>
    </Card>
  );
}
