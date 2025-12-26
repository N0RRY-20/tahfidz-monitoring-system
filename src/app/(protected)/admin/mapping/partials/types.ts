export interface Santri {
  id: string;
  fullName: string;
  classId: string | null;
  className: string | null;
  guruId: string | null;
  guruName: string | null;
}

export interface Guru {
  id: string;
  name: string;
  santriCount: number;
}

export interface Kelas {
  id: string;
  name: string;
}
