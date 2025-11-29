"use client";
import { useState } from "react";
import { useSession } from "../../contexts/SessionContext";

export type SortSettings = {
  playerName: string;
  algorithm: "bubble" | "insertion";
  difficulty: number;
};

export default function SortSettingsModal({
  onStart,
}: {
  onStart: (settings: SortSettings) => void;
}) {
  const { session, setSession } = useSession();
  
  const [playerName, setPlayerName] = useState(session?.playerName || "");
  const [algorithm, setAlgorithm] = useState<"bubble" | "insertion">(session?.algorithm || "bubble");
  const [difficulty, setDifficulty] = useState(session?.difficulty || 400);

  function handleStart() {
    if (!playerName.trim()) return;
    
    const settings = {
      playerName,
      algorithm,
      difficulty,
    };
    
    setSession(settings);
    onStart(settings);
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center z-[999]">
      <div className="bg-zinc-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-zinc-700">
        <h1 className="text-4xl font-bold text-white mb-8 text-center tracking-tight">
          Sortiermeister
        </h1>

        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Spielername
            </label>
            <input
              className="w-full bg-zinc-700/50 border border-zinc-600 text-white p-3 rounded-lg 
                         placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 
                         focus:border-transparent transition-all"
              placeholder="Gib deinen Namen ein..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Sortieralgorithmus
            </label>
            <select
              className="w-full bg-zinc-700/50 border border-zinc-600 text-white p-3 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent 
                         transition-all cursor-pointer"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as "bubble" | "insertion")}
            >
              <option value="bubble">Bubble Sort</option>
              <option value="insertion">Insertion Sort</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Schwierigkeit
            </label>
            <select
              className="w-full bg-zinc-700/50 border border-zinc-600 text-white p-3 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent 
                         transition-all cursor-pointer"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
            >
              <option value={1200}>Easy</option>
              <option value={800}>Medium</option>
              <option value={350}>Hard</option>
              <option value={150}>Impossible</option>
            </select>
          </div>

          <button
            onClick={handleStart}
            disabled={!playerName.trim()}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold 
                       rounded-xl py-3.5 mt-4 hover:from-violet-500 hover:to-purple-500 
                       disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed 
                       transition-all duration-200 shadow-lg hover:shadow-violet-500/50"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
