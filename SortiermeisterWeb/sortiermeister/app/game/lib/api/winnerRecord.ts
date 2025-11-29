import { fetchFromAPI } from "./api";

export async function sendWinnerRecord(data: {
    name: string;
    time: number;
    achievedAt?: string;
}) {
    const payload = {
        name: data.name,
        time: data.time,
        achievedAt: data.achievedAt || new Date().toISOString().split('T')[0],
    };
    console.log(payload);
    await fetchFromAPI("/api/WinnerRecord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}