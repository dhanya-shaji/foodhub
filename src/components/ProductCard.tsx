"use client";

import Image from "next/image";
import type { Product } from "@/data/products";
import { useStore } from "@/context/StoreContext";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export default function ProductCard({ product, priority }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative h-40 w-full">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover"
          priority={priority}
        />
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-2 top-2 rounded-full px-2.5 py-1.5 text-sm shadow-sm transition ${
            wishlisted
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-white/90 text-zinc-800 hover:bg-white"
          }`}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-medium">{product.name}</h3>
            <div className="text-xs text-zinc-500">{product.category}</div>
          </div>
          <div className="shrink-0 rounded-md bg-zinc-100 px-2 py-1 text-sm font-semibold dark:bg-zinc-800">
            €{product.price.toFixed(2)}
          </div>
        </div>
        <button
          className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          type="button"
          onClick={() => addToCart(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
