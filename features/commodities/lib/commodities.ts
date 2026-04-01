export interface Commodity {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stats: { label: string; value: string }[];
  image?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
}

export const COMMODITIES: Commodity[] = [
  {
    id: "gold",
    name: "Gold",
    tagline: "The Ultimate Store of Value",
    description:
      "Gold remains the most credible monetary asset in history. In an era of fiscal expansion, negative real rates, and geopolitical fragmentation, gold's structural bull case has never been stronger. Central banks are buying at record pace — and retail hasn't noticed yet.",
    stats: [
      { label: "Current Price", value: "$3,082 / oz" },
      { label: "YTD Performance", value: "+14.2%" },
      { label: "Central Bank Demand (2024)", value: "1,037 tonnes" },
    ],
    image: undefined,
    imageAlt: "Gold bars and macro textures",
    imagePosition: "right",
  },
  {
    id: "copper",
    name: "Copper",
    tagline: "Powering the Energy Transition",
    description:
      "Copper is the nervous system of the modern economy. Every EV requires 4x more copper than a combustion vehicle. Every solar farm, data center, and offshore wind turbine runs on copper. The supply response takes a decade. The demand curve is already here.",
    stats: [
      { label: "Current Price", value: "$4.38 / lb" },
      { label: "YTD Performance", value: "+8.6%" },
      { label: "EV Demand Forecast (2030)", value: "+5.4 Mt/yr" },
    ],
    image: undefined,
    imageAlt: "Copper wire and industrial infrastructure",
    imagePosition: "left",
  },
];

export async function getCommodities(): Promise<Commodity[]> {
  return COMMODITIES;
}
