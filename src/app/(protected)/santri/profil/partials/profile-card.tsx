"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { User, GraduationCap } from "lucide-react";

interface ProfileCardProps {
  fullName: string;
  className: string | null;
  guruName: string | null;
  dob: string | null;
  createdAt: Date | null;
  progressPercent: number;
  totalAyat: number;
}

export function ProfileCard({
  fullName,
  className,
  guruName,
  dob,
  createdAt,
  progressPercent,
  totalAyat,
}: ProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Informasi Santri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name and Badges */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">{fullName}</h2>
          <div className="flex flex-wrap items-center gap-2">
            {className && (
              <Badge variant="secondary" className="gap-1">
                <GraduationCap className="h-3 w-3" />
                {className}
              </Badge>
            )}
            {guruName && (
              <Badge variant="outline" className="gap-1">
                <User className="h-3 w-3" />
                Guru: {guruName}
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Tanggal Lahir</p>
            <p className="font-medium">{dob || "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Bergabung Sejak</p>
            <p className="font-medium">
              {createdAt
                ? new Date(createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                  })
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Progress Khatam</p>
            <div className="flex items-center gap-2">
              <Progress value={progressPercent} className="flex-1" />
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {progressPercent}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">Total Hafalan</p>
            <p className="font-medium">
              {totalAyat.toLocaleString()} / 6.236 ayat
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
