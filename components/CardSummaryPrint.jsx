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

export function CardSummaryPrint({ totalPrint, trendValue, trendLabel }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardDescription>Total Cetak ID Card</CardDescription>
        <CardTitle className="text-4xl font-semibold tabular-nums @[250px]:text-5xl">
          {totalPrint}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {trendValue >= 50 ? (
              <IoMdTrendingUp className="text-semibold text-green-600" />
            ) : (
              <IoMdTrendingDown className="text-semibold text-red-600" />
            )}
            {trendLabel}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-md flex items-center gap-2">
          Rasio ID Card yang Dicetak
          {trendValue >= 50 ? (
            <IoMdTrendingUp className="size-4 text-green-600" />
          ) : (
            <IoMdTrendingDown className="size-4 text-red-600" />
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
