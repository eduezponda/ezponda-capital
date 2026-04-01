"use client";

import Link from "next/link";
import Input from "@/components/ui/Input";

export default function SignupForm() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/" className="flex items-center gap-2 mb-8">
          <span className="text-sm font-bold uppercase tracking-[0.2rem] text-white">Ezponda</span>
          <span className="text-sm font-bold uppercase tracking-[0.2rem] text-gold">Capital</span>
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight">Request Access</h1>
        <p className="text-[0.875rem] text-outline mt-1">
          Join a curated group of commodity-focused investors.
        </p>
      </div>

      <form className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input id="firstName" type="text" label="First Name" placeholder="Eduardo" className="flex-1" />
          <Input id="lastName"  type="text" label="Last Name"  placeholder="Ezponda"  className="flex-1" />
        </div>
        <Input id="email"    type="email"    label="Email"    placeholder="you@example.com" />
        <Input id="password" type="password" label="Password" placeholder="••••••••" />

        <div className="mt-2">
          <label className="text-[0.6875rem] uppercase tracking-[0.05rem] font-medium text-secondary block mb-2">
            What&apos;s your primary focus?
          </label>
          <select className="w-full bg-surface-container-highest text-on-surface px-6 py-4 rounded outline-none border border-transparent focus:ring-1 focus:ring-tertiary transition-all">
            <option value="">Select an interest…</option>
            <option value="gold">Gold &amp; Precious Metals</option>
            <option value="copper">Copper &amp; Industrial Metals</option>
            <option value="macro">Macro &amp; Global Cycles</option>
            <option value="all">All of the above</option>
          </select>
        </div>

        <button
          type="submit"
          className="gold-gradient text-black font-bold text-[0.75rem] uppercase tracking-[0.08rem] px-8 py-4 rounded-xl hover:shadow-[0_0_30px_rgba(255,224,132,0.25)] active:scale-95 transition-all mt-2"
        >
          Request Access
        </button>
      </form>

      <p className="text-center text-[0.8125rem] text-outline">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-tertiary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
