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

// NEW: 10-category color system matching the heatmap calendar
export function getHeatmapColorClass(score: number | null | undefined) {
  if (score == null) return "bg-zinc-800/60";
  
  // Using the same 10-category system as the heatmap
  if (score >= 90) return "bg-indigo-400";   // 90-100
  if (score >= 80) return "bg-blue-400";     // 80-89
  if (score >= 70) return "bg-sky-400";      // 70-79
  if (score >= 60) return "bg-teal-400";     // 60-69
  if (score >= 50) return "bg-green-400";    // 50-59
  if (score >= 40) return "bg-lime-400";     // 40-49
  if (score >= 30) return "bg-yellow-400";   // 30-39
  if (score >= 20) return "bg-amber-500";    // 20-29
  if (score >= 10) return "bg-orange-500";   // 10-19
  return "bg-rose-600";                      // 0-9
}

// NEW: Text color for heatmap colors
export function getHeatmapTextColorClass(score: number | null | undefined) {
  if (score == null) return "text-zinc-400";
  
  // Light text for darker backgrounds, dark text for lighter backgrounds
  if (score >= 50) return "text-zinc-900"; // Lighter colors: green, lime, yellow
  return "text-zinc-100"; // Darker colors: indigo, blue, sky, teal, amber, orange, rose
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