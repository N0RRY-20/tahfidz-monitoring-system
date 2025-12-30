"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full bg-muted/20 animate-pulse" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`rounded-full w-10 h-10 relative transition-all duration-500 border overflow-hidden ${
        isDark
          ? "bg-slate-950 hover:bg-slate-900 border-slate-800 text-blue-400 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
          : "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-500 shadow-[0_0_20px_-5px_rgba(245,158,11,0.5)]"
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ y: -20, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {isDark ? (
            <Moon className="h-5 w-5 fill-current" />
          ) : (
            <Sun className="h-5 w-5 fill-current" />
          )}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
