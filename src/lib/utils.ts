import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shuffle_array(array: unknown[]) {
  const new_array = [...array];

  let currentIndex = new_array.length;

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [new_array[currentIndex], new_array[randomIndex]] = [
      new_array[randomIndex],
      new_array[currentIndex],
    ];
  }

  return new_array;
}

export function createSlugger() {
  const occurrences = new Map<string, number>();

  return (text: string): string => {
    // Generate clean base slug
    const baseSlug = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const count = occurrences.get(baseSlug) ?? 0;
    occurrences.set(baseSlug, count + 1);

    // First time seeing this slug, return it plain. Otherwise, append counter.
    return count === 0 ? baseSlug : `${baseSlug}-${count}`;
  };
}
