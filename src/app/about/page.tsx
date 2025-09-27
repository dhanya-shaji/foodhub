import React from "react";

const AboutPage: React.FC = () => {
  return (
    <main className="min-h-dvh">
      <section className="container mx-auto max-w-5xl px-4 py-16">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">About Us</h1>
            <p className="mt-4 text-base/7 text-zinc-600 dark:text-zinc-300">
              We build modern web experiences focused on performance, accessibility, and delightful user interfaces.
              Our mission is to turn complex ideas into simple, beautiful products.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-zinc-200 bg-white/60 p-4 text-center shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="text-2xl font-semibold">5+</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Years</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white/60 p-4 text-center shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="text-2xl font-semibold">20+</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Projects</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white/60 p-4 text-center shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="text-2xl font-semibold">10k+</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Users</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white/60 p-4 text-center shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="text-2xl font-semibold">99.9%</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50/50 py-12 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-medium">Our Values</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Craft, curiosity, and care. We obsess over the details so our users do not have to.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-medium">How We Work</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Small, focused teams, rapid iteration, and continuous feedback from real users.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-medium">What We Use</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Next.js, TypeScript, and modern CSS utilities to deliver fast, reliable apps.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-8 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900">
          <h2 className="text-2xl font-semibold">Our Story</h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
            Started as a small studio, we have grown into a product team shipping features used by thousands. We believe
            technology should be approachable and empowering, not overwhelming.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium">2019</div>
              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Founded the team</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium">2021</div>
              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">First 1,000 users</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium">2024</div>
              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Platform rewrite and scale-up</div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Get in touch
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-transparent px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Explore the product
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
