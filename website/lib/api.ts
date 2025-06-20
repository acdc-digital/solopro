export async function exportData() {
  const res = await fetch("/api/export-data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch export");
  }
  
  // Get the JSON payload as blob
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `soloist-export-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
} 