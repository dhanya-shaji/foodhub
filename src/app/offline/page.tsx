export const metadata = { title: "Offline | FoodHub" };

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        You&apos;re offline
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-300">
        Check your connection and try again. Pages you&apos;ve already visited
        may still be available. Placing orders needs an internet connection.
      </p>
    </main>
  );
}
