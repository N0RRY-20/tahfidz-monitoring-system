"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ChevronLeft, ChevronRight, AlertCircle, BookOpen, Calendar } from "lucide-react";
import { getColorClass, getStatusLabel } from "./helpers";

interface FullRecord {
  id: string;
  surahName: string;
  type: string;
  ayatStart: number;
  ayatEnd: number;
  colorStatus: string;
  notes: string | null;
  date: string;
  tags: string[];
}

interface MonthlyHeatmapProps {
  records: FullRecord[];
}

// Get days in a month
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Get start day of the month (0 = Sunday)
function getStartDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// Format date to YYYY-MM-DD
function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

// Format date for display
function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Month names in Indonesian
const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// Day names
const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];


// Calculate streak of days without setoran
function calculateMissedStreak(records: FullRecord[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const recordDates = new Set(records.map(r => r.date));
  let streak = 0;
  
  const checkDate = new Date(today);
  
  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    
    if (recordDates.has(dateStr)) {
      break;
    }
    
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
    
    if (streak >= 30) break;
  }
  
  return streak;
}

export function MonthlyHeatmap({ records }: MonthlyHeatmapProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startDay = getStartDayOfMonth(currentYear, currentMonth);

  // Calculate missed streak
  const missedStreak = calculateMissedStreak(records);
  const todayStr = today.toISOString().split('T')[0];
  const hasTodayRecord = records.some(r => r.date === todayStr);

  // Group records by date for calendar display
  const recordMapForCalendar = new Map<string, { ziyadah: string | null; murajaah: string | null }>();

  records.forEach((record) => {
    const key = record.date;
    if (!recordMapForCalendar.has(key)) {
      recordMapForCalendar.set(key, { ziyadah: null, murajaah: null });
    }
    const existing = recordMapForCalendar.get(key)!;
    if (record.type === "ziyadah") {
      if (!existing.ziyadah || getStatusPriority(record.colorStatus) > getStatusPriority(existing.ziyadah)) {
        existing.ziyadah = record.colorStatus;
      }
    } else {
      if (!existing.murajaah || getStatusPriority(record.colorStatus) > getStatusPriority(existing.murajaah)) {
        existing.murajaah = record.colorStatus;
      }
    }
  });

  function getStatusPriority(status: string): number {
    if (status === "G") return 3;
    if (status === "Y") return 2;
    if (status === "R") return 1;
    return 0;
  }

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  function handleDateClick(day: number) {
    const dateKey = formatDate(currentYear, currentMonth, day);
    setSelectedDate(dateKey);
    setSheetOpen(true);
  }

  // Get records for selected date
  const selectedRecords = selectedDate 
    ? records.filter(r => r.date === selectedDate)
    : [];

  // Build calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };


  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Kalender Setoran</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[140px] text-center">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Warning Banner */}
          {!hasTodayRecord && (
            <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-amber-800 dark:text-amber-200 text-sm">
                  Hari ini belum setor
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {missedStreak > 1 
                    ? `Sudah ${missedStreak} hari tidak setor. Yuk semangat! 💪` 
                    : "Jangan lupa setoran hari ini ya! ✨"}
                </p>
              </div>
            </div>
          )}

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const dateKey = formatDate(currentYear, currentMonth, day);
              const dayData = recordMapForCalendar.get(dateKey) || { ziyadah: null, murajaah: null };
              const hasAnyRecord = dayData.ziyadah || dayData.murajaah;
              const isTodayCell = isToday(day);
              const isTodayNoRecord = isTodayCell && !hasAnyRecord;

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 md:p-2 transition-all hover:shadow-md cursor-pointer
                    ${isTodayNoRecord 
                      ? "ring-2 ring-amber-400 ring-offset-1 bg-amber-50 dark:bg-amber-950/30 animate-pulse" 
                      : isTodayCell 
                        ? "ring-2 ring-primary ring-offset-1" 
                        : ""
                    }
                    ${hasAnyRecord
                      ? "bg-muted/50 hover:bg-muted/70"
                      : "bg-muted/20 border border-dashed border-muted-foreground/30 hover:border-muted-foreground/50"
                    }
                  `}
                >
                  <span className={`text-xs md:text-sm font-medium ${
                    isTodayNoRecord 
                      ? "text-amber-600 dark:text-amber-400" 
                      : isTodayCell 
                        ? "text-primary" 
                        : "text-foreground"
                  }`}>
                    {day}
                  </span>

                  {hasAnyRecord && (
                    <div className="flex gap-0.5 mt-1">
                      {dayData.ziyadah && (
                        <div
                          className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${getColorClass(dayData.ziyadah)} shadow-sm`}
                          title={`Ziyadah: ${getStatusLabel(dayData.ziyadah)}`}
                        />
                      )}
                      {dayData.murajaah && (
                        <div
                          className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-none ${getColorClass(dayData.murajaah)} shadow-sm`}
                          title={`Murajaah: ${getStatusLabel(dayData.murajaah)}`}
                        />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t space-y-3">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/50" />
                <span className="text-muted-foreground">Ziyadah (●)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-none bg-muted-foreground/50" />
                <span className="text-muted-foreground">Murajaah (■)</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span>Mutqin</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500" />
                <span>Jayyid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span>Rasib</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border-2 border-dashed border-muted-foreground/30 bg-muted" />
                <span>Belum</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded ring-2 ring-amber-400 bg-amber-50 dark:bg-amber-950/30" />
                <span className="text-amber-600 dark:text-amber-400">Hari ini belum setor</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sheet for selected date records */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {selectedDate && formatDisplayDate(selectedDate)}
            </SheetTitle>
            <SheetDescription>
              {selectedRecords.length > 0 
                ? `${selectedRecords.length} setoran pada hari ini`
                : "Tidak ada setoran pada hari ini"
              }
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {selectedRecords.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
                <p className="font-medium text-foreground mb-1">Tidak ada setoran</p>
                <p className="text-sm text-muted-foreground">
                  Belum ada setoran di tanggal ini 📚
                </p>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {selectedRecords.map((record) => (
                  <div key={record.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full ${getColorClass(record.colorStatus)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {record.colorStatus}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{record.surahName}</span>
                          <Badge variant="secondary" className="text-xs">
                            {record.type === "ziyadah" ? "Ziyadah" : "Murajaah"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Ayat {record.ayatStart} - {record.ayatEnd} • {getStatusLabel(record.colorStatus)}
                        </p>
                        {record.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {record.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        )}
                        {record.notes && (
                          <p className="text-sm text-muted-foreground italic mt-2">
                            &quot;{record.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
