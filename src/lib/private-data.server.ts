// SERVER ONLY. This file must never be imported from client code.
// Edit here to update your private medications/supplements list.

export type PrivateItem = {
  id: string;
  name: string;
  dose: string;
  time: "morning" | "afternoon" | "evening" | "bedtime";
  notes?: string;
};

export const PRIVATE_ITEMS: PrivateItem[] = [
  { id: "vit-d", name: "Vitamin D3", dose: "2000 IU", time: "morning", notes: "With breakfast" },
  { id: "omega", name: "Omega-3", dose: "1g", time: "morning" },
  { id: "creatine", name: "Creatine monohydrate", dose: "5g", time: "afternoon", notes: "Post-workout on training days" },
  { id: "magnesium", name: "Magnesium glycinate", dose: "400mg", time: "bedtime" },
  { id: "multivit", name: "Multivitamin", dose: "1 tablet", time: "morning" },
];
