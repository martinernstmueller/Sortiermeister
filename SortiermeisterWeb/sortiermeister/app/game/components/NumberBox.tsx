"use client";
import { motion } from "framer-motion";

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
    <motion.div
      className={`h-36 w-36 flex items-center justify-center 
                  text-3xl font-bold rounded-xl ${actualColor} 
                  cursor-pointer select-none shadow-lg hover:shadow-2xl 
                  transition-shadow duration-200 border-2 border-white/20`}
      animate={{ scale: isActive ? 1.15 : 1 }}
      transition={{ scale: { duration: 0.15 }, type: "spring", stiffness: 300 }}
      whileHover={{ y: -4 }}
    >
      <h1 className="text-white drop-shadow-lg">{number}</h1>
    </motion.div>
  );
}
