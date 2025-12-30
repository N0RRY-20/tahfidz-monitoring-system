export function getColorClass(status: string | null) {
  switch (status) {
    case "G": return "bg-green-500";
    case "Y": return "bg-yellow-500";
    case "R": return "bg-red-500";
    default: return "bg-gray-300";
  }
}

export function getStatusLabel(status: string | null) {
  switch (status) {
    case "G": return "Mutqin";
    case "Y": return "Jayyid";
    case "R": return "Rasib";
    default: return "-";
  }
}
