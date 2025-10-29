// src/types.ts
export interface StickyNote {
  id: string;
  text: string;
  dueDate?: string;
  completed: boolean;
  x: number;
  y: number;
  z: number;
  color: string;
}