"use client";
import { useState, useRef, useEffect } from "react";
import NumberBox from "./NumberBox";
import SortSettingsModal, { SortSettings } from "./SortSettings";
import { bubbleSort } from "../algorithms/bubbleSort";
import { insertionSort } from "../algorithms/insertionSort";
import { sendWinnerRecord } from "../lib/api/winnerRecord";

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

export default function NumberRow({ numbers }: { numbers: number[] }) {
    const [settings, setSettings] = useState<SortSettings | null>(null);
    const [playerArray, setPlayerArray] = useState<ColoredNumber[]>([]);
    const [botArray, setBotArray] = useState<ColoredNumber[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [firstSelected, setFirstSelected] = useState<number | null>(null);
    const [winPopup, setWinPopup] = useState<{ time: number } | null>(null);
    const [losePopup, setLosePopup] = useState<boolean>(false);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        const init = numbers.map(n => ({
            number: n,
            color: randomColor(),
        }));

        setPlayerArray(init);
        setBotArray(init.map(x => ({ ...x })));
    }, [numbers]);

    function handleStart(s: SortSettings) {
        setSettings(s);
        startTimeRef.current = Date.now();
        setTimeout(() => runBotSort(s), 300);
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

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milli).padStart(3, "0")}`;
    }

    function checkWin(arr: ColoredNumber[]) {
        const sorted = [...arr].sort((a, b) => a.number - b.number);

        if (arr.every((v, i) => v.number === sorted[i].number)) {
            const total = Date.now() - startTimeRef.current;

            setWinPopup({ time: total });
            console.log(settings!.playerName, total);
            sendWinnerRecord({
                name: settings!.playerName,
                time: total,
            });
        }
    }

    async function runBotSort(s: SortSettings) {
        const sorter = algorithms[s.algorithm];
        const arr = [...botArray];

        for await (const step of sorter(arr)) {

            setBotArray([...step.array]);
            setActiveIndex(step.activeNumber);

            const sorted = [...step.array].sort((a, b) => a.number - b.number);
            const botFinished = step.array.every((v, i) => v.number === sorted[i].number);

            if (botFinished) {
                setLosePopup(true);
                return;
            }

            await new Promise(res => setTimeout(res, s.difficulty));
        }

        setActiveIndex(null);
    }

    function restartGame() {
        const init = numbers.map(n => ({
            number: n,
            color: randomColor(),
        }));

        setPlayerArray(init);
        setBotArray(init.map(x => ({ ...x })));

        setFirstSelected(null);
        setActiveIndex(null);

        startTimeRef.current = Date.now();
        setWinPopup(null);
        setLosePopup(false);
        setSettings(null);
    }

    return (
        <div className="flex flex-col gap-10 items-center">

            {!settings && <SortSettingsModal onStart={handleStart} />}
            <div className="flex gap-4">
                {playerArray.map((obj, i) => (
                    <button
                        key={i}
                        onClick={() => handlePlayerClick(i)}
                        className={`${firstSelected === i ? "ring-4 ring-purple-400" : ""}`}
                    >
                        <NumberBox number={obj.number} color={obj.color} />
                    </button>
                ))}
            </div>

            <div className="flex gap-4">
                {botArray.map((obj, i) => (
                    <NumberBox
                        key={i}
                        number={obj.number}
                        color={obj.color}
                        isActive={activeIndex === i}
                    />
                ))}
            </div>

            {winPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
                    <div className="bg-gray-400 p-8 rounded-xl shadow-xl flex flex-col items-center gap-4">
                        <h2 className="text-2xl font-bold text-green-600">
                            🎉 DU HAST GEWONNEN!
                        </h2>

                        <p className="text-xl font-mono text-purple-600">
                            Zeit: {formatTime(winPopup.time)}
                        </p>

                        <button
                            onClick={restartGame}
                            className="px-4 py-2 bg-purple-600 rounded-2xl text-white hover:bg-purple-700 transition"
                        >
                            Restart
                        </button>
                    </div>
                </div>
            )}

            {losePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[999]">
                    <div className="bg-red-500 p-8 rounded-xl shadow-xl flex flex-col items-center gap-4">
                        <h2 className="text-2xl font-bold text-white">
                            ❌ DU HAST VERLOREN!
                        </h2>

                        <p className="text-lg text-white">
                            Der Bot war schneller 😈
                        </p>

                        <button
                            onClick={restartGame}
                            className="px-4 py-2 bg-black rounded-xl text-white hover:bg-gray-900 transition"
                        >
                            Restart
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}