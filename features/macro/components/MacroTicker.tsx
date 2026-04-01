import Ticker from "@/components/ui/Ticker";
import { getSpotPrices } from "@/lib/api/prices";

export default async function MacroTicker() {
  const items = await getSpotPrices();
  return <Ticker items={items} />;
}
