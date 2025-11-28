"use client";

export default function NumberBox({
    number,
    color,
    isActive = false,
}: {
    number: number;
    color: string;
    isActive?: boolean;
}) {
    const isClient = typeof window !== "undefined";
    const actualColor = isClient ? color : "bg-gray-300";

    return (
        <div
            className={`h-36 w-36 border-2 border-black flex items-center justify-center 
                  text-2xl font-bold rounded-md ${actualColor} origin-center 
                  cursor-pointer select-none transition-transform duration-150 ${isActive ? "scale-110" : "scale-100"
                }`}
        >
            <h1>{number}</h1>
        </div>
    );
}