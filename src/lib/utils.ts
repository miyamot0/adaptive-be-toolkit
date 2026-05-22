import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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