import { Badge } from "@/components/ui/badge";
import { getColorClass, getStatusLabel } from "./helpers";

interface RecordCardProps {
  record: {
    id: string;
    surahName: string;
    type: string;
    ayatStart: number;
    ayatEnd: number;
    colorStatus: string;
    notes: string | null;
    date: string;
  };
  tags: string[];
}

export function RecordCard({ record, tags }: RecordCardProps) {
  return (
    <div className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {/* Status Badge */}
          <div 
            className={`w-10 h-10 rounded-full ${getColorClass(record.colorStatus)} flex items-center justify-center text-white text-xs font-bold shrink-0`}
          >
            {record.colorStatus}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm md:text-base">
                {record.surahName}
              </span>
              <Badge 
                variant="secondary" 
                className="text-[10px] md:text-xs"
              >
                {record.type === "ziyadah" ? "Ziyadah" : "Murajaah"}
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Ayat {record.ayatStart} - {record.ayatEnd}
            </p>
            
            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className="text-[10px] md:text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Notes */}
            {record.notes && (
              <p className="text-xs md:text-sm text-muted-foreground italic mt-2">
                &quot;{record.notes}&quot;
              </p>
            )}
          </div>
        </div>
        
        {/* Date & Status */}
        <div className="text-right shrink-0">
          <p className="text-xs md:text-sm text-muted-foreground">
            {record.date}
          </p>
          <span className="text-[10px] md:text-xs text-muted-foreground">
            {getStatusLabel(record.colorStatus)}
          </span>
        </div>
      </div>
    </div>
  );
}
