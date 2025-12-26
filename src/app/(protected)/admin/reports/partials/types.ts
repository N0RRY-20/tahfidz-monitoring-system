export interface ReportData {
  santriId: string;
  santriName: string;
  classId: string | null;
  className: string | null;
  guruName: string | null;
  totalSetoran: number;
  totalAyat: number;
  greenCount: number;
  yellowCount: number;
  redCount: number;
}

export interface Kelas {
  id: string;
  name: string;
}

export interface ReportStats {
  totalSetoran: number;
  totalAyat: number;
  greenCount: number;
  yellowCount: number;
  redCount: number;
}
