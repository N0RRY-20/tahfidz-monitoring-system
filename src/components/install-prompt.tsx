"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const isInStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    setIsStandalone(isInStandalone);

    // Check if iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    // Check if dismissed recently (24 hours)
    const dismissedAt = localStorage.getItem("pwa-install-dismissed");
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const now = Date.now();
      const hoursSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) {
        return; // Don't show if dismissed within 24 hours
      }
    }

    // Show prompt if not installed
    if (!isInStandalone) {
      // Delay showing to not be intrusive on first load
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  // Don't show if already installed
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in slide-in-from-bottom-4 duration-300">
      <div className="relative rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 shadow-2xl shadow-emerald-500/20">
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-2 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
            <Download className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 pr-6">
            <h3 className="font-semibold text-white">Install Aplikasi</h3>
            {isIOS ? (
              <p className="mt-1 text-sm text-white/80">
                Tap <Share className="inline h-4 w-4 -mt-0.5" /> lalu pilih{" "}
                <strong>&quot;Add to Home Screen&quot;</strong>
              </p>
            ) : (
              <p className="mt-1 text-sm text-white/80">
                Akses lebih cepat langsung dari home screen
              </p>
            )}
          </div>
        </div>

        {!isIOS && (
          <Button
            onClick={handleInstall}
            className="mt-3 w-full bg-white text-emerald-700 hover:bg-white/90 font-medium"
          >
            <Download className="mr-2 h-4 w-4" />
            Install Sekarang
          </Button>
        )}
      </div>
    </div>
  );
}
