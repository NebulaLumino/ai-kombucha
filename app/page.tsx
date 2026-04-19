"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const ACCENT = "bg-blue-500";
const ACCENT_TEXT = "text-blue-400";
const ACCENT_GLOW = "shadow-blue-500/20";

export default function KombuchaFermented() {
  const [scobyHealth, setScobyHealth] = useState("");
  const [batchSize, setBatchSize] = useState("");
  const [flavorDirection, setFlavorDirection] = useState("");
  const [roomTemp, setRoomTemp] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scobyHealth || !batchSize || !flavorDirection || !roomTemp) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scobyHealth, batchSize, flavorDirection, roomTemp }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data.result || "");
    } catch {
      setError("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <header className="border-b border-white/10 px-6 py-5 flex items-center gap-3">
        <div className={`w-10 h-10 ${ACCENT} rounded-xl flex items-center justify-center text-xl`}>🍵</div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Kombucha & Fermented Tea Helper</h1>
          <p className="text-sm text-gray-400">Brew timelines, pH schedules & troubleshooting</p>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">SCOBY Health</label>
            <select value={scobyHealth} onChange={e => setScobyHealth(e.target.value)}
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors">
              <option value="" className="bg-gray-900">Select SCOBY health...</option>
              <option value="healthy" className="bg-gray-900">Healthy — thick, white, active</option>
              <option value="new" className="bg-gray-900">New — thin, growing</option>
              <option value="weak" className="bg-gray-900">Weak — slow fermentation</option>
              <option value="concerning" className="bg-gray-900">Concerning — discoloration, odor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Batch Size</label>
            <select value={batchSize} onChange={e => setBatchSize(e.target.value)}
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors">
              <option value="" className="bg-gray-900">Select batch size...</option>
              <option value="small (1 gallon)" className="bg-gray-900">Small (1 gallon / ~3.8L)</option>
              <option value="medium (2 gallons)" className="bg-gray-900">Medium (2 gallons / ~7.6L)</option>
              <option value="large (3+ gallons)" className="bg-gray-900">Large (3+ gallons)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Flavor Direction</label>
            <input value={flavorDirection} onChange={e => setFlavorDirection(e.target.value)} placeholder="e.g., ginger-lemon, berry, floral, citrus..."
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Room Temperature (°F)</label>
            <input type="number" value={roomTemp} onChange={e => setRoomTemp(e.target.value)} placeholder="e.g., 72"
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${ACCENT} hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${ACCENT_GLOW}`}>
            {loading ? "Generating Brew Plan..." : "Generate Brew Plan"}
          </button>
        </form>
        <div className="flex flex-col">
          <h2 className={`text-sm font-semibold uppercase tracking-wider ${ACCENT_TEXT} mb-3`}>AI Output</h2>
          <div className="flex-1 bg-gray-800/40 border border-white/10 rounded-xl p-6 overflow-y-auto max-h-[600px]">
            {result ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-500 italic">Your kombucha brew plan will appear here...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
