// Standardized color categories aligned with AI prompts
export function getColorClass(score: number | null | undefined) {
  if (score == null) return "bg-zinc-800/60";
  
  // Using standardized 6-category system
  if (score >= 85) return "bg-emerald-500"; // DEEP GREEN: Exceptional Day
  if (score >= 68) return "bg-green-500";   // GREEN: Good Day
  if (score >= 51) return "bg-yellow-500";  // YELLOW: Balanced Day
  if (score >= 34) return "bg-orange-500";  // ORANGE: Challenging Day
  if (score >= 17) return "bg-red-500";     // RED: Difficult Day
  return "bg-rose-700";                     // DEEP RED: Crisis Day
}

// Get border color class for consistency
export function getBorderColorClass(score: number | null | undefined) {
  if (score == null) return "border-zinc-700/50";
  
  if (score >= 85) return "border-emerald-500";
  if (score >= 68) return "border-green-500";
  if (score >= 51) return "border-yellow-500";
  if (score >= 34) return "border-orange-500";
  if (score >= 17) return "border-red-500";
  return "border-rose-700";
}

// Get text color class for readability
export function getTextColorClass(score: number | null | undefined) {
  if (score == null) return "text-zinc-400";
  if (score >= 51) return "text-zinc-900"; // Dark text for lighter backgrounds
  return "text-zinc-100"; // Light text for darker backgrounds
}

// Get color category information
export function getScoreCategory(score: number | null | undefined) {
  if (score == null) return { name: "No Data", color: "zinc" };
  
  if (score >= 85) return { name: "Exceptional Day", color: "emerald" };
  if (score >= 68) return { name: "Good Day", color: "green" };
  if (score >= 51) return { name: "Balanced Day", color: "yellow" };
  if (score >= 34) return { name: "Challenging Day", color: "orange" };
  if (score >= 17) return { name: "Difficult Day", color: "red" };
  return { name: "Crisis Day", color: "rose" };
} 