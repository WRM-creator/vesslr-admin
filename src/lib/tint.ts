// Shared "tinted chip" class strings for status badges, callouts, and tags.
//
// Each hue has:
//   - Light mode: bg-{hue}-100 text-{hue}-800 border-{hue}-200 hover:bg-{hue}-100/80
//   - Dark mode : bg-{hue}-500/15 text-{hue}-300 border-{hue}-900/50 hover:bg-{hue}-500/25
//
// Tailwind's JIT requires full class names to exist statically in source, so
// this is a literal map rather than a template-string helper.
//
// Usage:
//   import { TINT } from "@/lib/tint";
//   <Badge className={TINT.blue}>Open</Badge>

export const TINT: Record<string, string> = {
  blue: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100/80 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-900/50 dark:hover:bg-blue-500/25",
  sky: "bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-100/80 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-900/50 dark:hover:bg-sky-500/25",
  indigo:
    "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-100/80 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-900/50 dark:hover:bg-indigo-500/25",
  violet:
    "bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-100/80 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-900/50 dark:hover:bg-violet-500/25",
  purple:
    "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100/80 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-900/50 dark:hover:bg-purple-500/25",
  green:
    "bg-green-100 text-green-800 border-green-200 hover:bg-green-100/80 dark:bg-green-500/15 dark:text-green-300 dark:border-green-900/50 dark:hover:bg-green-500/25",
  emerald:
    "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-900/50 dark:hover:bg-emerald-500/25",
  teal: "bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-100/80 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-900/50 dark:hover:bg-teal-500/25",
  yellow:
    "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100/80 dark:bg-yellow-500/15 dark:text-yellow-300 dark:border-yellow-900/50 dark:hover:bg-yellow-500/25",
  amber:
    "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100/80 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-900/50 dark:hover:bg-amber-500/25",
  orange:
    "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100/80 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-900/50 dark:hover:bg-orange-500/25",
  red: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100/80 dark:bg-red-500/15 dark:text-red-300 dark:border-red-900/50 dark:hover:bg-red-500/25",
  rose: "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100/80 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-900/50 dark:hover:bg-rose-500/25",
  pink: "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-100/80 dark:bg-pink-500/15 dark:text-pink-300 dark:border-pink-900/50 dark:hover:bg-pink-500/25",
  gray: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100/80 dark:bg-gray-500/15 dark:text-gray-300 dark:border-gray-800/50 dark:hover:bg-gray-500/25",
};

// Soft callout variant — lighter `*-50` background with `*-200` border.
// Use for alert/info boxes rather than chips.
export const CALLOUT: Record<string, string> = {
  blue: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-200",
  green:
    "bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-900/50 dark:text-green-200",
  amber:
    "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-200",
  yellow:
    "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/30 dark:border-yellow-900/50 dark:text-yellow-200",
  red: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-200",
  orange:
    "bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-950/30 dark:border-orange-900/50 dark:text-orange-200",
};
