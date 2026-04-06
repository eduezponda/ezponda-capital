import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Stripe SDK v17+ moved current_period_* off the top-level Subscription type.
// The fields are still present in the API response at runtime — this helper reads them safely.
function subPeriod(sub: Stripe.Subscription, field: "current_period_start" | "current_period_end"): string {
  const ts = (sub as unknown as Record<string, number>)[field] ?? Math.floor(Date.now() / 1000);
  return new Date(ts * 1000).toISOString();
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[/api/stripe/webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const subscriptionId = session.subscription as string | null;

        if (!userId || !subscriptionId) break;

        // Promote user to subscriber
        await supabase
          .from("profiles")
          .update({ role: "subscriber", stripe_customer_id: session.customer as string })
          .eq("id", userId);

        // Fetch full subscription details for period dates
        const sub = await stripe.subscriptions.retrieve(subscriptionId);

        await supabase.from("subscriptions").upsert({
          user_id: userId,
          stripe_subscription_id: subscriptionId,
          stripe_price_id: sub.items.data[0]?.price.id ?? "",
          status: sub.status,
          current_period_start: subPeriod(sub, "current_period_start"),
          current_period_end: subPeriod(sub, "current_period_end"),
          updated_at: new Date().toISOString(),
        }, { onConflict: "stripe_subscription_id" });

        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;

        await supabase
          .from("subscriptions")
          .update({
            status: sub.status,
            stripe_price_id: sub.items.data[0]?.price.id ?? "",
            current_period_start: subPeriod(sub, "current_period_start"),
            current_period_end: subPeriod(sub, "current_period_end"),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", sub.id);

        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        await supabase
          .from("subscriptions")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id);

        // Downgrade user to free tier
        const { data: rows } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", sub.id)
          .limit(1);

        const userId = rows?.[0]?.user_id;
        if (userId) {
          await supabase
            .from("profiles")
            .update({ role: "free" })
            .eq("id", userId);
        }

        break;
      }

      default:
        // Unhandled event type — not an error
        break;
    }
  } catch (err) {
    console.error("[/api/stripe/webhook] handler error:", err);
    // Still return 200 to prevent Stripe from retrying
  }

  return NextResponse.json({ received: true });
}
