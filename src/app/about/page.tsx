import Link from "next/link";
import React from "react";

const AboutPage: React.FC = () => {
  return (
    <main className="min-h-dvh">
      <section className="relative flex h-64 items-center justify-center bg-gradient-to-r from-black to-gray-800">
        <div className="px-4 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">About FoodHub</h1>
          <p className="text-lg md:text-xl">
            Fresh flavors, warm hospitality, and meals made with care
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Welcome to our kitchen
          </h2>
          <p className="mt-4 text-base/7 text-zinc-600 dark:text-zinc-300">
            FoodHub is a neighborhood restaurant built around one idea: great food should feel
            simple, generous, and unforgettable. From handcrafted pizza and gourmet burgers to
            fresh sushi and house desserts, every plate starts with quality ingredients and a
            kitchen that cooks with pride.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { value: "8+", label: "Years serving" },
            { value: "50+", label: "Menu dishes" },
            { value: "15k+", label: "Happy guests" },
            { value: "4.8★", label: "Guest rating" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white/60 px-3 py-4 text-center shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <div className="whitespace-nowrap text-xl font-semibold tabular-nums sm:text-2xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50/50 py-12 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-medium">Fresh ingredients</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                We source seasonal produce, quality meats, and fresh seafood so every dish tastes
                bright and honest.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-medium">Cooked with care</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Our chefs prepare each order with attention to detail—whether you dine in, take
                out, or order for delivery.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-medium">Made for sharing</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                FoodHub is a place for weeknight comfort, weekend gatherings, and celebrations
                around the table.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-8 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900">
          <h2 className="text-2xl font-semibold">Our story</h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
            What began as a small local kitchen has grown into FoodHub—a restaurant known for
            generous portions, friendly service, and a menu that brings together pizza, burgers,
            sushi, and desserts under one roof. We still cook like a neighborhood spot: welcoming,
            consistent, and always hungry to improve.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium">2017</div>
              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Opened our first kitchen
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium">2020</div>
              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Launched delivery &amp; takeout
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium">2024</div>
              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Expanded the full FoodHub menu
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/product"
              className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              View our menu
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-transparent px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Reserve or inquire
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
