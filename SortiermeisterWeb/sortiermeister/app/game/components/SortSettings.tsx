"use client";
import { useState } from "react";

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
  const [playerName, setPlayerName] = useState("");
  const [algorithm, setAlgorithm] = useState<"bubble" | "insertion">("bubble");
  const [difficulty, setDifficulty] = useState(400);

  function handleStart() {
    if (!playerName.trim()) return;
    onStart({
      playerName,
      algorithm,
      difficulty,
    });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <div className="bg-gray-400 p-6 rounded-xl w-80 flex flex-col gap-4">

        <h2 className="text-xl font-bold text-white">Sortiermeister</h2>

        <input
          className="border p-2 rounded"
          placeholder="Spielername"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as "bubble" | "insertion")}
        >
          <option value="bubble">Bubble Sort</option>
          <option value="insertion">Insertion Sort</option>
        </select>

        <select
          className="border p-2 rounded"
          value={difficulty}
          onChange={(e) => setDifficulty(Number(e.target.value))}
        >
          <option value={800}>Easy</option>
          <option value={400}>Medium</option>
          <option value={150}>Hard</option>
          <option value={20}>Impossible</option>
        </select>

        <button
          onClick={handleStart}
          className="bg-blue-600 text-white rounded-xl py-2 mt-4"
        >
          Start
        </button>
      </div>
    </div>
  );
}
