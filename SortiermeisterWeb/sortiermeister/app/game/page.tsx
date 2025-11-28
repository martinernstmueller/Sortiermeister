"use client";
import { useState } from "react";
import NumberRow from "./components/NumberRow";

export default function Page() {
  function generateUniqueNumbers(): number[] {
    const nums = new Set<number>();
    while (nums.size < 8) {
      nums.add(Math.floor(Math.random() * 50) + 1);
    }
    return [...nums];
  }

  const [numbers, setNumbers] = useState<number[]>(() => generateUniqueNumbers());
  const [showSettings, setShowSettings] = useState(false);

  function handleRestart() {
    setNumbers(generateUniqueNumbers());
  }

  function handleChangeDifficulty() {
    setShowSettings(true);
    setNumbers(generateUniqueNumbers());
    setTimeout(() => setShowSettings(false), 0);
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-10 
                    bg-gradient-to-br from-zinc-900 via-black to-zinc-900 py-8">
      <h1 className="text-5xl font-bold text-white tracking-tight">
        Sortiermeister
      </h1>
      <NumberRow 
        numbers={numbers} 
        onRestart={handleRestart}
        onChangeDifficulty={handleChangeDifficulty}
      />
    </div>
  );
}
