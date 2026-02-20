import { Meal } from "@/components/pages/plan/calendar/Calendar";

const WEEK_STARTS_ON_MONDAY = true;

export function addDays(d: Date, days: number) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}

export function startOfWeek(d: Date) {
  const nd = new Date(d);
  const day = nd.getDay();
  const offset = WEEK_STARTS_ON_MONDAY ? (day === 0 ? -6 : 1 - day) : -day;
  return addDays(nd, offset);
}

export function endOfWeek(d: Date) {
  return addDays(startOfWeek(d), 6);
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function compareTime24h(a: string, b: string) {
  return a.localeCompare(b);
}

// export function groupMealsByDate(meals: Meal[]) {
//   const map = new Map<string, Meal[]>();
//   for (const m of meals) {
//     const arr = map.get(m.dateISO) ?? [];
//     arr.push(m);
//     map.set(m.dateISO, arr);
//   }
//   for (const [k, arr] of map) {
//     arr.sort((a, b) => compareTime24h(a.time24h, b.time24h));
//     map.set(k, arr);
//   }
//   return map;
// }

export function safeId() {
  // Browser-safe UUID fallback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g: any = globalThis as any;
  return typeof g.crypto?.randomUUID === "function"
    ? g.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function isValidTime(v: string) {
  // "HH:mm"
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
}

export function getMonthRangeISO(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const toISO = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  return { fromISO: toISO(start), toISO: toISO(end) };
}

export function groupMealsByDate(meals: Meal[]) {
  const map = new Map<string, Meal[]>();
  for (const m of meals) {
    const arr = map.get(m.dayISO);
    if (arr) arr.push(m);
    else map.set(m.dayISO, [m]);
  }
  return map;
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function toDateISO(d: Date) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}
