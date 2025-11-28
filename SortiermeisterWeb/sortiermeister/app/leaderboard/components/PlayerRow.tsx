type PlayerRowProps = {
    rank: number;
    name: string;
    time: number; 
    achievedAt: Date;
};

export default function PlayerRow({ rank, name, time } : PlayerRowProps) {
    const getRankStyle = () => {
        if (rank === 1) {
            return {
                gradient: "bg-gradient-to-r from-yellow-600/30 to-yellow-500/30",
                border: "border-yellow-500/50",
                icon: "??"
            };
        } else if (rank === 2) {
            return {
                gradient: "bg-gradient-to-r from-gray-400/20 to-gray-300/20",
                border: "border-gray-400/50",
                icon: "??"
            };
        } else if (rank === 3) {
            return {
                gradient: "bg-gradient-to-r from-orange-600/30 to-orange-500/30",
                border: "border-orange-500/50",
                icon: "??"
            };
        }
        return {
            gradient: "bg-zinc-700/30",
            border: "border-zinc-600/50",
            icon: ""
        };
    };

    const style = getRankStyle();
    
    return (
        <div className={`w-full rounded-xl border-2 ${style.border} ${style.gradient} 
                        backdrop-blur-sm transition-all duration-200 
                        hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20`}>
            <div className="grid grid-cols-[100px_1fr_150px] items-center px-6 py-4 gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-white">
                        {rank}
                    </span>
                    {style.icon && (
                        <span className="text-2xl">
                            {style.icon}
                        </span>
                    )}
                </div>
                
                <div className="font-semibold text-lg text-white truncate">
                    {name}
                </div>
                
                <div className="font-mono text-sm text-zinc-300 text-center">
                    {time}
                </div>
              
               <div className="font-semibold text-lg text-white truncate">
                    {achievedAt}
                </div>
            </div>
        </div>
    )
}