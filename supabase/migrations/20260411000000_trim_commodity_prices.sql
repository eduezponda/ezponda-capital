-- Retention policy: keep only the latest 168 rows per symbol (7 days × 24h).
-- Triggered after every INSERT on commodity_prices so the table never grows unbounded.

CREATE OR REPLACE FUNCTION trim_commodity_prices()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM commodity_prices
  WHERE id IN (
    SELECT id
    FROM commodity_prices
    WHERE symbol = NEW.symbol
    ORDER BY fetched_at DESC
    OFFSET 168
  );
  RETURN NULL;
END;
$$;

CREATE OR REPLACE TRIGGER trg_trim_commodity_prices
AFTER INSERT ON commodity_prices
FOR EACH ROW
EXECUTE FUNCTION trim_commodity_prices();
