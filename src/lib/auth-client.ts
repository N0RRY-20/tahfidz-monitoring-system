"use client";

import { createAuthClient } from "better-auth/react";

// Auto-detect the base URL for auth API calls
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // Client-side: use current origin
    return window.location.origin;
  }
  // Server-side fallback (though this is a client-only file)
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signUp, signOut, useSession } = authClient;
