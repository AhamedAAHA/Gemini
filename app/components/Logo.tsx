import Link from "next/link";
import { cn } from "@/app/components/ui/cn";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 font-bold text-slate-950">
        B
      </span>
      <span className="text-lg font-bold tracking-tight">
        Bill<span className="text-scan-gradient">Scope</span>
      </span>
    </Link>
  );
}
