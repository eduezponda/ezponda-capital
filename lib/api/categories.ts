export const CATEGORIES = ["All", "Gold", "Copper", "Macro", "Real Assets"] as const;
export type Category = (typeof CATEGORIES)[number];
