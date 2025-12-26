import { Card, CardContent } from "@/components/ui/card";
import { ReportStats } from "./types";

interface ReportStatsProps {
  stats: ReportStats;
  totalSantri: number;
}

export function ReportStatsCards({ stats, totalSantri }: ReportStatsProps) {
  const cards = [
    {
      label: "Total Santri",
      value: totalSantri,
      color: "text-slate-900 dark:text-slate-100",
    },
    {
      label: "Total Setoran",
      value: stats.totalSetoran,
      color: "text-slate-900 dark:text-slate-100",
    },
    {
      label: "Mutqin",
      value: stats.greenCount,
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "Jayyid",
      value: stats.yellowCount,
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "Rasib",
      value: stats.redCount,
      color: "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <Card key={i}>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {card.label}
            </p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
