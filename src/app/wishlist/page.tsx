"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Wishlist</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Saved dishes you want to try later.
      </p>

      {wishlist.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
          <p className="text-zinc-600 dark:text-zinc-400">
            No items in your wishlist yet.
          </p>
          <Link
            href="/product"
            className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Browse menu
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="relative h-44 w-full">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-xs text-zinc-500">{product.category}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    €{product.price.toFixed(2)}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="flex-1 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Add to cart
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
