"use client";
import { useState } from "react";
import NumberRow from "./components/NumberRow";

export default function Page() {
  const [numbers, setNumbers] = useState(() =>
    Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 1)
  );

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Sortiermeister</h1>

      <NumberRow numbers={numbers} />
    </div>
  );
}
