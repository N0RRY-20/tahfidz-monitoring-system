"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Menu,
  X,
  Quote,
  ArrowRight,
  Instagram,
  Facebook,
  Youtube,
  User,
  Lock,
  Copy,
  Check,
  LayoutDashboard,
} from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const SparklesCore = dynamic(
  () => import("@/components/ui/sparkles").then((mod) => mod.SparklesCore),
  { ssr: false }
);

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-emerald-500/20">
      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b bg-background/80 backdrop-blur-md shadow-sm"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="container px-4 md:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Tahfidz Monitoring
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <ModeToggle />
            <div className="h-6 w-px bg-border/50 mx-2" />
            {isPending ? (
              <div className="h-9 w-24 bg-muted animate-pulse rounded-full" />
            ) : session?.user ? (
              <Link href="/dashboard">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 rounded-full px-6">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="rounded-full px-6 hover:bg-emerald-50 text-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                  >
                    Masuk
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 rounded-full px-6">
                    Daftar Sekarang
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden gap-4">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b bg-background px-4 pb-4 space-y-4 overflow-hidden shadow-xl"
            >
              <div className="grid gap-2 pt-2">
                {session?.user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                        Masuk
                      </Button>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        Daftar Sekarang
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column: Text */}
              <motion.div
                className="flex flex-col text-center lg:text-left space-y-8"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <div className="space-y-4 cursor-default">
                  <motion.div
                    variants={itemVariants}
                    className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300 backdrop-blur-sm mx-auto lg:mx-0"
                  >
                    <span className="flex h-2 w-2 rounded-full bg-emerald-600 mr-2 animate-pulse"></span>
                    Sistem Monitoring Tahfidz Modern
                  </motion.div>
                  <motion.h1
                    variants={itemVariants}
                    className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent leading-[1.2] pb-1"
                  >
                    Pantau Hafalan Santri <br />
                    <span className="text-emerald-600">
                      Lebih Efektif & Realtime
                    </span>
                  </motion.h1>
                  <motion.p
                    variants={itemVariants}
                    className="mx-auto lg:mx-0 max-w-[600px] text-muted-foreground md:text-xl leading-relaxed"
                  >
                    Platform digital terintegrasi untuk memudahkan guru, santri,
                    dan wali santri dalam memonitor perkembangan hafalan
                    Al-Qur&apos;an secara transparan dan akurat.
                  </motion.p>
                </div>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 text-lg shadow-lg hover:shadow-emerald-500/25 transition-all"
                    >
                      Mulai Sekarang
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto h-12 px-8 text-lg border-2 hover:bg-accent hover:text-accent-foreground"
                    >
                      Pelajari Fitur
                    </Button>
                  </Link>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto h-12 px-8 text-lg border-2 border-emerald-200/50 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100/80 hover:text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 backdrop-blur-sm transition-all"
                      >
                        <User className="mr-2 h-5 w-5" />
                        Akun Demo
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Akses Akun Demo</DialogTitle>
                        <DialogDescription>
                          Gunakan kredensial berikut untuk mencoba fitur lengkap
                          sebagai Admin.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <div className="relative">
                            <Input
                              readOnly
                              value="admin@example.com"
                              className="pr-10 bg-muted/50 font-mono"
                            />
                            <CopyButton value="admin@example.com" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Password</Label>
                          <div className="relative">
                            <Input
                              readOnly
                              value="password"
                              type="text"
                              className="pr-10 bg-muted/50 font-mono"
                            />
                            <CopyButton value="password" />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Link href="/login" className="w-full sm:w-auto">
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                            Lanjut ke Login
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              </motion.div>

              {/* Right Column: 3D Image */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative hidden md:block"
              >
                {/* Sparkles Background (Replacing simple blob) */}
                <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] -z-10 [mask-image:radial-gradient(50%_50%,white,transparent_70%)]">
                  <SparklesCore
                    id="hero-sparkles"
                    background="transparent"
                    minSize={0.4}
                    maxSize={1.5}
                    particleDensity={40}
                    className="w-full h-full"
                    particleColor="#10b981" // Emerald-500
                  />
                </div>
                {/* Keep Subtle Blob behind sparkles for depth */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-emerald-500/10 rounded-full blur-[80px] -z-20 animate-pulse" />

                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 6,
                    ease: "easeInOut",
                  }}
                  className="relative z-10 drop-shadow-2xl"
                >
                  <div className="relative aspect-square w-full max-w-[600px] mx-auto">
                    <Image
                      src="/images/hero-3d.jpeg"
                      alt="Tahfidz Monitoring Dashboard 3D"
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-muted/30 relative">
          <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />

          <div className="container px-4 md:px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-emerald-950 dark:text-emerald-50">
                Fitur Unggulan
              </h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto text-lg">
                Didesain khusus untuk memenuhi kebutuhan lembaga tahfidz modern
                dengan pendekatan visual yang menarik.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                image="/images/feature-1.jpeg"
                title="Dashboard Interaktif"
                description="Pantau perkembangan santri melalui visualisasi data 3D yang modern dan mudah dipahami oleh semua pengguna."
              />
              <FeatureCard
                image="/images/feature-2.jpeg"
                title="Tracking Realtime"
                description="Catat setoran ziyadah dan murajaah dengan antarmuka yang intuitif dan responsif di berbagai perangkat."
              />
              <FeatureCard
                image="/images/feature-3.jpeg"
                title="Analisis Mendalam"
                description="Dapatkan wawasan mendalam tentang progres hafalan dengan grafik dan laporan statistik yang akurat."
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
                Apa Kata Mereka?
              </h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                Testimoni dari pengguna yang telah merasakan manfaat sistem ini.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  text: "Sistem ini sangat membantu saya memantau hafalan anak saya secara realtime. Tampilannya juga sangat modern!",
                  author: "Ibu Siti",
                  role: "Wali Santri",
                },
                {
                  text: "Sebagai guru, pencatatan setoran jadi lebih mudah dan terorganisir. Tidak perlu buku manual lagi.",
                  author: "Ustadz Ahmad",
                  role: "Pengajar Tahfidz",
                },
                {
                  text: "Grafik progressnya memotivasi saya untuk terus menambah hafalan agar grafiknya terus naik.",
                  author: "Fatih",
                  role: "Santri",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border bg-muted/20 hover:bg-muted/50 transition-colors"
                >
                  <Quote className="h-8 w-8 text-emerald-500 mb-4 opacity-50" />
                  <p className="mb-6 text-muted-foreground leading-relaxed italic">
                    &quot;{item.text}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500" />
                    <div>
                      <p className="font-semibold">{item.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-muted/30">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
                Pertanyaan Umum
              </h2>
              <p className="text-muted-foreground">
                Jawaban untuk pertanyaan yang sering diajukan.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  q: "Apakah aplikasi ini berbayar?",
                  a: "Saat ini aplikasi dapat digunakan secara gratis untuk lembaga pendidikan terpilih selama masa beta.",
                },
                {
                  q: "Apakah data hafalan aman?",
                  a: "Ya, kami menggunakan enkripsi standar industri untuk menjaga keamanan data santri dan lembaga.",
                },
                {
                  q: "Bisa diakses di HP?",
                  a: "Tentu saja! Tampilan aplikasi sudah dioptimalkan untuk berbagai ukuran layar, termasuk smartphone.",
                },
                {
                  q: "Bagaimana cara mendaftar?",
                  a: "Klik tombol Sign Up di pojok kanan atas, isi data diri, dan tunggu verifikasi dari admin lembaga.",
                },
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-600 dark:bg-emerald-900" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="container relative z-10 px-4 md:px-6 text-center text-white">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-6">
              Siap Meningkatkan Kualitas Tahfidz?
            </h2>
            <p className="max-w-[600px] mx-auto text-emerald-100 mb-8 text-lg">
              Bergabunglah dengan ratusan lembaga lainnya yang telah beralih ke
              sistem digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto font-bold text-emerald-700 hover:text-emerald-800"
                >
                  Daftar Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Replacement with FooterGlow logic */}
      <footer className="relative z-10 w-full overflow-hidden pt-12 pb-8 border-t bg-emerald-50/50 dark:bg-emerald-950/10">
        <style jsx global>{`
          .glass {
            backdrop-filter: blur(8px) saturate(180%);
            background: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.7) 0%,
              rgba(167, 243, 208, 0.2) 60%,
              rgba(209, 250, 229, 0.1) 100%
            );
            border: 1px solid rgba(16, 185, 129, 0.1);
          }
          .dark .glass {
            background: radial-gradient(
              circle,
              rgba(6, 78, 59, 0.3) 0%,
              rgba(6, 95, 70, 0.2) 60%,
              rgba(4, 47, 46, 0.1) 100%
            );
            border: 1px solid rgba(52, 211, 153, 0.1);
          }
        `}</style>

        <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-full -translate-x-1/2 select-none">
          <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"></div>
          <div className="absolute right-1/4 -bottom-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"></div>
        </div>

        <div className="glass relative mx-auto flex max-w-6xl flex-col items-center gap-8 rounded-2xl px-6 py-10 md:flex-row md:items-start md:justify-between md:gap-12 shadow-lg shadow-emerald-500/5">
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Tahfidz Monitoring
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-xs text-center text-sm md:text-left">
              Platform modern untuk memudahkan monitoring hafalan Al-Qur&apos;an
              di era digital.
            </p>
            <div className="flex gap-4 text-emerald-600 dark:text-emerald-400">
              <Link
                href="#"
                className="hover:text-emerald-800 dark:hover:text-emerald-200 transition"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="hover:text-emerald-800 dark:hover:text-emerald-200 transition"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="hover:text-emerald-800 dark:hover:text-emerald-200 transition"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3 text-center md:text-left w-full md:w-auto">
            <div>
              <div className="mb-3 text-xs font-semibold tracking-widest text-emerald-600 uppercase">
                Navigasi
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground">
                    Fitur
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Biaya
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Testimoni
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-3 text-xs font-semibold tracking-widest text-emerald-600 uppercase">
                Tentang
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Profil Lembaga
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-3 text-xs font-semibold tracking-widest text-emerald-600 uppercase">
                Bantuan
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Panduan
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="container relative z-10 mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Tahfidz Monitoring System. Hak Cipta
          Dilindungi.
        </div>
      </footer>
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => {
        setHasCopied(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [hasCopied]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setHasCopied(true);
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground"
      onClick={copyToClipboard}
    >
      {hasCopied ? (
        <Check className="h-4 w-4 text-emerald-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span className="sr-only">Copy</span>
    </Button>
  );
}

function FeatureCard({
  image,
  title,
  description,
}: {
  image: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border bg-background hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="aspect-[4/3] w-full relative overflow-hidden bg-muted">
        <Image
          src={image}
          alt={title}
          fill
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSIRMxQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8Aw+G9ubWJo4LmaNGOSqOQCfvVS0126s7RLdLq4CINoHkP9pSuS1g1ODCgBepz/9k="
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
      </div>

      <div className="p-6 relative">
        <h3 className="mb-3 text-xl font-bold group-hover:text-emerald-600 transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
