import Ticker from "@/components/ui/Ticker";
import { getSpotPrices } from "@/lib/api/prices";

export default async function MacroTicker() {
  const items = await getSpotPrices();
  if (items.length === 0) return null;
  return <Ticker items={items} />;
}
