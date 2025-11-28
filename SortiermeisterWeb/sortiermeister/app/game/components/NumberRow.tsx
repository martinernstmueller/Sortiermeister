"use client";
import { useState, useRef, useEffect } from "react";
import NumberBox from "./NumberBox";
import SortSettingsModal, { SortSettings } from "./SortSettings";
import { bubbleSort } from "../algorithms/bubbleSort";
import { insertionSort } from "../algorithms/insertionSort";
import { sendWinnerRecord } from "../lib/api/winnerRecord";
import { useSession } from "../../contexts/SessionContext";

export type ColoredNumber = {
  number: number;
  color: string;
};

const colors = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
  "bg-orange-500", "bg-cyan-500", "bg-lime-500", "bg-amber-500",
];

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

const algorithms = {
  bubble: bubbleSort,
  insertion: insertionSort,
};

export default function NumberRow({ 
  numbers, 
  onRestart,
  onChangeDifficulty,
}: { 
  numbers: number[], 
  onRestart: () => void,
  onChangeDifficulty: () => void,
}) {
  const { session, clearSession } = useSession();
  const [settings, setSettings] = useState<SortSettings | null>(null);
  const [playerArray, setPlayerArray] = useState<ColoredNumber[]>([]);
  const [botArray, setBotArray] = useState<ColoredNumber[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [firstSelected, setFirstSelected] = useState<number | null>(null);
  const [winPopup, setWinPopup] = useState<{ time: number } | null>(null);
  const [losePopup, setLosePopup] = useState<boolean>(false);
  const startTimeRef = useRef<number>(0);
  const stopRef = useRef<boolean>(false);
  const startDelay = 3000;
  
  useEffect(() => {
    const init = numbers.map(n => ({
      number: n,
      color: randomColor(),
    }));

    setPlayerArray(init);
    setBotArray(init.map(x => ({ ...x })));
  }, [numbers]);

  useEffect(() => {
    if (session && !settings) {
      handleStart(session);
    }
  }, [session]);

  function handleStart(s: SortSettings) {
    setSettings(s);
    startTimeRef.current = Date.now();
    stopRef.current = false;
    setTimeout(() => runBotSort(s), startDelay);
  }

  function handlePlayerClick(i: number) {
    if (firstSelected === null) {
      setFirstSelected(i);
      return;
    }

    if (firstSelected !== i) {
      const copy = [...playerArray];
      [copy[firstSelected], copy[i]] = [copy[i], copy[firstSelected]];
      setPlayerArray(copy);
      checkWin(copy);
    }

    setFirstSelected(null);
  }

  function formatTime(ms: number) {
    const hours = Math.floor(ms / 3600000);
    ms %= 3600000;
    const minutes = Math.floor(ms / 60000);
    ms %= 60000;
    const seconds = Math.floor(ms / 1000);
    const milli = ms % 1000;
    return `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}.${String(milli).padStart(3,"0")}`;
  }

  function checkWin(arr: ColoredNumber[]) {
    const sorted = [...arr].sort((a, b) => a.number - b.number);

    if (arr.every((v, i) => v.number === sorted[i].number)) {
      const total = Date.now() - startTimeRef.current;
      setWinPopup({ time: total });

      sendWinnerRecord({
        name: settings!.playerName,
        time: total
      });

      stopRef.current = true;
    }
  }

  async function runBotSort(s: SortSettings) {
    const sorter = algorithms[s.algorithm];
    const arr = [...botArray];

    for await (const step of sorter(arr)) {
      if (stopRef.current) return;

      const sorted = [...step.array].sort((a, b) => a.number - b.number);
      const botFinished = step.array.every((v, i) => v.number === sorted[i].number);

      if (botFinished) {
        if (!stopRef.current) setLosePopup(true);
        return;
      }

      if (stopRef.current) return;

      setBotArray([...step.array]);
      setActiveIndex(step.activeNumber);

      await new Promise(res => setTimeout(res, s.difficulty));
    }

    setActiveIndex(null);
  }

  function handlePlayAgain() {
    stopRef.current = true;
    setWinPopup(null);
    setLosePopup(false);
    setFirstSelected(null);
    setActiveIndex(null);
    setSettings(null);
    
    onRestart();
  }

  function handleChangeDifficultyClick() {
    stopRef.current = true;
    setWinPopup(null);
    setLosePopup(false);
    setSettings(null);
    onChangeDifficulty();
  }

  function handleLogout() {
    stopRef.current = true;
    clearSession();
    setWinPopup(null);
    setLosePopup(false);
    setSettings(null);
    onChangeDifficulty();
  }

  return (
    <div className="flex flex-col gap-12 items-center w-full px-4">

      {!settings && <SortSettingsModal onStart={handleStart} />}

      <div className="flex flex-col gap-8 items-center w-full">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-xl font-semibold text-violet-400 tracking-wide">
            Du sortierst
          </h2>
          <div className="flex gap-4 flex-wrap justify-center">
            {playerArray.map((obj, i) => (
              <button
                key={i}
                onClick={() => handlePlayerClick(i)}
                className={`transition-all duration-200 ${
                  firstSelected === i ? "ring-4 ring-violet-400 ring-offset-4 ring-offset-black scale-105" : ""
                }`}
              >
                <NumberBox number={obj.number} color={obj.color} />
              </button>
            ))}
          </div>
        </div>

        <div className="h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>

        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-xl font-semibold text-red-400 tracking-wide">
            Bot
          </h2>
          <div className="flex gap-4 flex-wrap justify-center">
            {botArray.map((obj, i) => (
              <NumberBox
                key={i}
                number={obj.number}
                color={obj.color}
                isActive={activeIndex === i}
              />
            ))}
          </div>
        </div>
      </div>

      {winPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-gradient-to-br from-green-900 to-emerald-900 p-10 rounded-2xl shadow-2xl 
                          flex flex-col items-center gap-6 border-2 border-green-500/50 max-w-md w-full mx-4">
            <div className="text-6xl">🎉</div>
            
            <h2 className="text-3xl font-bold text-white text-center">
              Du hast gewonnen!
            </h2>

            <p className="text-zinc-300 text-center">
              Glückwunsch! Du warst schneller als der Bot.
            </p>

            <div className="bg-black/30 px-6 py-3 rounded-lg">
              <p className="text-sm text-zinc-400 mb-1 text-center">Deine Zeit</p>
              <p className="text-2xl font-mono text-green-400 font-bold text-center">
                {formatTime(winPopup.time)}
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full mt-2">
              <button
                onClick={handlePlayAgain}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 
                           rounded-xl text-white font-semibold hover:from-green-500 hover:to-emerald-500 
                           transition-all duration-200 shadow-lg"
              >
                Nochmal spielen
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleChangeDifficultyClick}
                  className="flex-1 px-4 py-2.5 bg-zinc-700 rounded-lg text-white text-sm 
                             hover:bg-zinc-600 transition-all duration-200"
                >
                  Schwierigkeit ändern
                </button>

                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 bg-zinc-700 rounded-lg text-white text-sm 
                             hover:bg-zinc-600 transition-all duration-200"
                >
                  Abmelden
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {losePopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-gradient-to-br from-red-900 to-rose-900 p-10 rounded-2xl shadow-2xl 
                          flex flex-col items-center gap-6 border-2 border-red-500/50 max-w-md w-full mx-4">
            <div className="text-6xl">😈</div>
            
            <h2 className="text-3xl font-bold text-white text-center">
              Du hast verloren!
            </h2>

            <p className="text-zinc-300 text-center">
              Der Bot war schneller. Versuch es nochmal!
            </p>

            <div className="flex flex-col gap-3 w-full mt-2">
              <button
                onClick={handlePlayAgain}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 
                           rounded-xl text-white font-semibold hover:from-red-500 hover:to-rose-500 
                           transition-all duration-200 shadow-lg"
              >
                Nochmal spielen
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleChangeDifficultyClick}
                  className="flex-1 px-4 py-2.5 bg-zinc-700 rounded-lg text-white text-sm 
                             hover:bg-zinc-600 transition-all duration-200"
                >
                  Schwierigkeit ändern
                </button>

                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 bg-zinc-700 rounded-lg text-white text-sm 
                             hover:bg-zinc-600 transition-all duration-200"
                >
                  Abmelden
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
