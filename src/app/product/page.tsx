"use client";

import React from "react";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
};

const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 8.99,
    imageUrl: "https://images.unsplash.com/photo-1548365328-9f547fb0953c?q=80&w=1200&auto=format&fit=crop",
    category: "Pizza",
  },
  {
    id: 2,
    name: "Cheeseburger",
    price: 7.49,
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 3,
    name: "Sushi Platter",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 4,
    name: "Caesar Salad",
    price: 6.49,
    imageUrl: "https://images.unsplash.com/photo-1566843972141-c21b7711b010?q=80&w=1200&auto=format&fit=crop",
    category: "Salad",
  },
  {
    id: 5,
    name: "Steak & Fries",
    price: 18.99,
    imageUrl: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?q=80&w=1200&auto=format&fit=crop",
    category: "Grill",
  },
  {
    id: 6,
    name: "Pancakes",
    price: 5.99,
    imageUrl: "https://images.unsplash.com/photo-1586985289907-49f1d54fbca8?q=80&w=1200&auto=format&fit=crop",
    category: "Breakfast",
  },
  {
    id: 7,
    name: "Pad Thai",
    price: 12.49,
    imageUrl: "https://images.unsplash.com/photo-1604908176997-4314fe7c5686?q=80&w=1200&auto=format&fit=crop",
    category: "Noodles",
  },
  {
    id: 8,
    name: "Tacos",
    price: 9.99,
    imageUrl: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=1200&auto=format&fit=crop",
    category: "Mexican",
  },
  {
    id: 9,
    name: "Chocolate Cake",
    price: 4.99,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop",
    category: "Dessert",
  },
  {
    id: 10,
    name: "Pho Noodle Soup",
    price: 10.99,
    imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=1200&auto=format&fit=crop",
    category: "Soup",
  },
  {
    id: 11,
    name: "BBQ Ribs",
    price: 16.99,
    imageUrl: "https://images.unsplash.com/photo-1604908812210-87bd3a3a9c5a?q=80&w=1200&auto=format&fit=crop",
    category: "Grill",
  },
  {
    id: 12,
    name: "Veggie Sandwich",
    price: 6.99,
    imageUrl: "https://images.unsplash.com/photo-1603048297172-c92544798d0d?q=80&w=1200&auto=format&fit=crop",
    category: "Sandwich",
  },
];

const PAGE_SIZE = 8;

export default function ProductListPage() {
  const [page, setPage] = React.useState(1);

  const totalPages = Math.ceil(ALL_PRODUCTS.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageItems = ALL_PRODUCTS.slice(startIndex, startIndex + PAGE_SIZE);

  function goToPage(next: number) {
    const bounded = Math.max(1, Math.min(totalPages, next));
    setPage(bounded);
  }

  return (
    <main className="flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-semibold">Food Menu</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        Explore our selection of delicious dishes.
      </p>

      <div className="mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pageItems.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="relative h-40 w-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover"
                priority={product.id <= 4}
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-medium">{product.name}</h3>
                  <div className="text-xs text-zinc-500">{product.category}</div>
                </div>
                <div className="shrink-0 rounded-md bg-zinc-100 px-2 py-1 text-sm font-semibold dark:bg-zinc-800">
                  ${product.price.toFixed(2)}
                </div>
              </div>
              <button
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                type="button"
              >
                Add to cart
              </button>
            </div>
          </div>
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
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
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
        ))}
        <button
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          type="button"
        >
          Next
        </button>
      </div>
    </main>
  );
}
