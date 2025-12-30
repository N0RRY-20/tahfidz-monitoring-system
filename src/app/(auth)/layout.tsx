"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session?.user) {
      // User already logged in, redirect to dashboard
      router.replace("/dashboard");
    }
  }, [session, isPending, router]);

  // Show loading or nothing while checking session
  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // If user is logged in, don't render children (will redirect)
  if (session?.user) {
    return null;
  }

  return <>{children}</>;
}
