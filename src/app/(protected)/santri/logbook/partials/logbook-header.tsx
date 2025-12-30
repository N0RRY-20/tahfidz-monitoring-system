import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface LogbookHeaderProps {
  title: string;
  subtitle: string;
}

export function LogbookHeader({ title, subtitle }: LogbookHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Link 
        href="/santri" 
        className="p-2 hover:bg-muted rounded-lg transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">
          {title}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
