import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json() as { priceId?: string };
    const priceId = body.priceId;

    if (!priceId) {
      return NextResponse.json({ error: "priceId is required" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/theses?checkout=success`,
      cancel_url: `${appUrl}/theses?checkout=canceled`,
      metadata: { user_id: user.id },
      customer_email: user.email,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[/api/stripe/create-checkout]", err);
    return NextResponse.json({ error: "Checkout creation failed" }, { status: 500 });
  }
}
