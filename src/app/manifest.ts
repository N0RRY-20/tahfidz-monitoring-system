import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tahfidz Monitoring",
    short_name: "Tahfidz",
    description: "Platform monitoring hafalan Al-Qur'an untuk Pondok Pesantren",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#10b981",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/mosque.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
