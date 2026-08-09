"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";

const DELIVERY_FEE = 2.5;

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } =
    useStore();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const grandTotal = cartTotal + (cart.length > 0 ? DELIVERY_FEE : 0);

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      router.push("/login");
      return;
    }

    if (cart.length === 0) return;

    setPlacing(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          delivery: {
            fullName: fullName || user.name,
            phone,
            address,
            city,
            notes,
          },
          paymentMethod,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Could not place order");
        return;
      }

      clearCart();
      setSuccess("Order saved to your account!");
      setTimeout(() => router.push("/profile"), 800);
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Your Cart</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Review items and enter delivery details to save the order.
      </p>

      {cart.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
          <p className="text-zinc-600 dark:text-zinc-400">Your cart is empty.</p>
          <Link
            href="/product"
            className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Browse menu
          </Link>
        </div>
      ) : (
        <form onSubmit={placeOrder} className="mt-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="relative h-24 w-full overflow-hidden rounded-lg sm:h-20 sm:w-20">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-zinc-500">{item.category}</p>
                <p className="mt-1 text-sm font-semibold">
                  €{item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="h-8 w-8 rounded-md border border-zinc-300 text-sm dark:border-zinc-700"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8 rounded-md border border-zinc-300 text-sm dark:border-zinc-700"
                >
                  +
                </button>
              </div>
              <div className="text-sm font-semibold sm:w-20 sm:text-right">
                €{(item.price * item.quantity).toFixed(2)}
              </div>
              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                className="text-sm text-zinc-500 underline hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold">Delivery details</h2>
            <p className="mt-1 text-sm text-zinc-500">
              These details are stored with your order in the database.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">
                  Full name
                </label>
                <input
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={user?.name || "Your name"}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-black focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                  Phone
                </label>
                <input
                  id="phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-black focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="mb-1.5 block text-sm font-medium">
                  Address
                </label>
                <input
                  id="address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-black focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
                />
              </div>
              <div>
                <label htmlFor="city" className="mb-1.5 block text-sm font-medium">
                  City
                </label>
                <input
                  id="city"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-black focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
                />
              </div>
              <div>
                <label htmlFor="paymentMethod" className="mb-1.5 block text-sm font-medium">
                  Payment method
                </label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-black focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
                >
                  <option value="cash">Cash on delivery</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">
                  Order notes (optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Extra spicy, leave at door, etc."
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-black focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span>€{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Delivery fee</span>
                <span>€{DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-lg font-semibold dark:border-zinc-800">
                <span>Total</span>
                <span>€{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            )}
            {success && (
              <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300">
                {success}
              </p>
            )}

            {!user && (
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                Sign in to place your order.{" "}
                <Link href="/login" className="underline">
                  Sign in
                </Link>
              </p>
            )}

            <button
              type="submit"
              disabled={placing || !user}
              className="mt-4 w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {placing
                ? "Saving order..."
                : user
                  ? "Place order"
                  : "Sign in to checkout"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
