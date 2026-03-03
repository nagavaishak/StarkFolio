import { clsx } from "clsx";

interface BadgeProps {
  variant?: "green" | "orange" | "purple" | "gray" | "red";
  children: React.ReactNode;
  className?: string;
}

const variants = {
  green: "bg-green-500/15 text-green-400 border border-green-500/25",
  orange: "bg-orange-500/15 text-orange-400 border border-orange-500/25",
  purple: "bg-purple-500/15 text-purple-400 border border-purple-500/25",
  gray: "bg-white/5 text-gray-400 border border-white/10",
  red: "bg-red-500/15 text-red-400 border border-red-500/25",
};

export function Badge({ variant = "gray", children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
