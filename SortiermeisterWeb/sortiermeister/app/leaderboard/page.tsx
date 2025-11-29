"use client";
import { useState, useEffect } from "react";
import PlayerRow from "./components/PlayerRow";
import { fetchFromAPI } from "../game/lib/api/api";

type WinnerRecord = {
    name: string;
    time: string;
    achievedAt: string;
};

async function getRanks(
    limit: number = 10,
    startDate?: Date,
    endDate?: Date
): Promise<WinnerRecord[]> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());

    if (startDate) {
        params.append('startDate', startDate.toISOString());
    }
    if (endDate) {
        params.append('endDate', endDate.toISOString());
    }

    const res = await fetchFromAPI(`/api/WinnerRecord?${params.toString()}`, {
        cache: "no-store"
    });
    return res.map((record: WinnerRecord) => ({
        name: record.name,
        time: record.time,
        achievedAt: record.achievedAt
    }));
}

export default function LeaderboardPage() {
    const [data, setData] = useState<WinnerRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const records = await getRanks();
                setData(records);
            } catch (error) {
                console.error('Failed to fetch leaderboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    const rankedPlayers = data.map((player, index) => ({
        ...player,
        rank: index + 1,
    }));

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full 
                        bg-gradient-to-br from-zinc-900 via-black to-zinc-900 py-10 px-4">
            <div className="w-full max-w-4xl">
                <h1 className="text-5xl font-bold text-white mb-8 text-center tracking-tight">
                    Leaderboard
                </h1>
                
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl border border-zinc-700 
                                shadow-2xl p-6 overflow-hidden">
                    <div className="overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                        <div className="space-y-3">
                            {rankedPlayers.map((player) => (
                                <PlayerRow 
                                    key={player.rank} 
                                    rank={player.rank} 
                                    name={player.name} 
                                    time={player.time}
                                    achievedAt={new Date(player.achievedAt)} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}