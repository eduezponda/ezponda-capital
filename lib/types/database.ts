export type UserRole = "superadmin" | "subscriber" | "free";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "incomplete";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  stripe_customer_id: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  source: string | null;
  active: boolean;
}

export interface CommodityPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change_pct: number;
  currency: string;
  unit: string;
  fetched_at: string;
}
