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
      className={`h-36 w-36 border-2 border-black flex items-center justify-center 
                  text-2xl font-bold rounded-md ${actualColor} origin-center 
                  cursor-pointer select-none`}
      animate={{ scale: isActive ? 1.1 : 1 }}
      transition={{ scale: { duration: 0.15 } }}
    >
      <h1>{number}</h1>
    </motion.div>
  );
}
