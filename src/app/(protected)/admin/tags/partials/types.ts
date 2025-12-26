export interface Tag {
  id: string;
  category: string;
  tagText: string;
}

export const CATEGORY_STYLES: Record<string, string> = {
  Makhraj:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  Tajwid:
    "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
  Kelancaran:
    "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  Irama:
    "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  Umum: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800",
};

export const SUGGESTED_CATEGORIES = [
  "Makhraj",
  "Tajwid",
  "Kelancaran",
  "Irama",
  "Umum",
  "Hafalan",
  "Adab",
];
