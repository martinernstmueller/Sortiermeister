import { fetchFromAPI } from "./api";

export async function sendWinnerRecord(data: {
    name: string;
    time: number;
    achievedAt?: string;
}) {
    const payload = {
        name: data.name,
        time: formatTimeSpan(data.time),
        achievedAt: data.achievedAt || new Date().toISOString().split('T')[0], // Just date part
    };
    console.log(payload);
    await fetchFromAPI("/api/WinnerRecord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

function formatTimeSpan(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}