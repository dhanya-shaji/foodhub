"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/data/products";
import { MENU_CATEGORIES } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const PAGE_SIZE = 8;

function ProductListContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const selectedCategory =
    categoryParam &&
    MENU_CATEGORIES.includes(
      categoryParam as (typeof MENU_CATEGORIES)[number]
    )
      ? categoryParam
      : "All";

  const [page, setPage] = React.useState(1);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/products");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load products");
        }
        if (!cancelled) {
          setProducts(data.products ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load products"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageItems = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);

  function goToPage(next: number) {
    const bounded = Math.max(1, Math.min(totalPages, next));
    setPage(bounded);
  }

  return (
    <main className="flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-semibold">Food Menu</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        {selectedCategory === "All"
          ? "Explore our selection of delicious dishes."
          : `Showing ${selectedCategory} dishes.`}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/product"
          className={`rounded-md px-3 py-1.5 text-sm transition ${
            selectedCategory === "All"
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "border border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          }`}
        >
          All
        </Link>
        {MENU_CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`/product?category=${encodeURIComponent(category)}`}
            className={`rounded-md px-3 py-1.5 text-sm transition ${
              selectedCategory === category
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "border border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            }`}
          >
            {category}
          </Link>
        ))}
      </div>

      {loading ? (
        <p className="mt-10 text-sm text-zinc-500">Loading menu...</p>
      ) : error ? (
        <p className="mt-10 text-sm text-red-600">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="mt-10 text-sm text-zinc-500">
          No products available
          {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}.
        </p>
      ) : (
        <>
          <div className="mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pageItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={product.id <= 4}
              />
            ))}
          </div>

          <div className="mt-10 flex items-center gap-2">
            <button
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              type="button"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
              (p) => (
                <button
                  key={p}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    p === page
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "border border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  }`}
                  onClick={() => goToPage(p)}
                  type="button"
                >
                  {p}
                </button>
              )
            )}
            <button
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              type="button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default function ProductListPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-col items-center justify-center p-8">
          <h1 className="text-3xl font-semibold">Food Menu</h1>
          <p className="mt-10 text-sm text-zinc-500">Loading menu...</p>
        </main>
      }
    >
      <ProductListContent />
    </Suspense>
  );
}
