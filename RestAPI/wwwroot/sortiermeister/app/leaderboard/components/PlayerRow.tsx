import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

type PlayerRowProps = {
    rank: number;
    name: string;
    time: Timestamp;
};

export default function PlayerRow({ rank, name, time } : PlayerRowProps) {
    let color = ""
    if (rank === 1) {
        color = "bg-yellow-400 border-yellow-700"
    } else if (rank === 2) {
        color = "bg-gray-400 border-gray-700"
    } else if (rank === 3) {
        color = "bg-yellow-700 border-yellow-900"
    } else {
        color = "bg-black border-slate-700"
    }
    return (
        <div className={`w-11/12 h-12 rounded-xl border-2 grid grid-cols-3 items-center px-4 justify-between mb-3 ${color}`}>
            <div className="font-bold">{rank}</div>
            <div className="font-bold">{name}</div>
            <div className="font-bold flex justify-end">{time}</div>
        </div>

    )
}