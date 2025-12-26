export interface Santri {
  id: string;
  fullName: string;
  classId: string | null;
  className: string | null;
  email: string;
  guruId: string | null;
  guruName: string | null;
  createdAt: string;
}

export interface Guru {
  id: string;
  name: string;
}

export interface Kelas {
  id: string;
  name: string;
  description: string | null;
}
