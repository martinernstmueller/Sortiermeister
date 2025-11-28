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

  function handleRestart() {
    setNumbers(generateUniqueNumbers());
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Sortiermeister</h1>
      <NumberRow numbers={numbers} onRestart={handleRestart} />
    </div>
  );
}
