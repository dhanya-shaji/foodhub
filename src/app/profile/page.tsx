"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type OrderItem = {
  productId: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
  subtotal: number;
};

type DeliveryDetails = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
};

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  delivery: DeliveryDetails;
  paymentMethod: string;
  createdAt: string;
};

const statusStyles: Record<string, string> = {
  pending:
    "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  confirmed: "bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
  preparing:
    "bg-violet-50 text-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
  delivered:
    "bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300",
  cancelled: "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300",
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    async function loadOrders() {
      setOrdersLoading(true);
      setError("");
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || "Could not load orders");
          return;
        }
        setOrders(data.orders || []);
      } catch {
        setError("Unable to load order history.");
      } finally {
        setOrdersLoading(false);
      }
    }

    loadOrders();
  }, [user, loading, router]);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  if (loading || !user) {
    return (
      <main className="container mx-auto max-w-4xl px-4 py-16 text-center text-zinc-500">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">My Profile</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Account details and order history from the database
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Log out
        </button>
      </div>

      <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Account</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500">
              Name
            </dt>
            <dd className="mt-1 font-medium">{user.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500">
              Email
            </dt>
            <dd className="mt-1 font-medium">{user.email}</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/product"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Order again
          </Link>
          <Link
            href="/wishlist"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            View wishlist
          </Link>
          <Link
            href="/cart"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            View cart
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Order details</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Orders saved in MongoDB for your account
        </p>

        {ordersLoading ? (
          <p className="mt-6 text-sm text-zinc-500">Loading orders...</p>
        ) : error ? (
          <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        ) : orders.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
            <p className="text-zinc-600 dark:text-zinc-400">
              No orders yet. Add items to your cart and check out.
            </p>
            <Link
              href="/product"
              className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Browse menu
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleString()} ·{" "}
                      {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                        statusStyles[order.status] || statusStyles.pending
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-sm font-semibold">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <ul className="mt-4 space-y-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  {order.items.map((item) => (
                    <li
                      key={`${order.id}-${item.productId}`}
                      className="flex items-center gap-3"
                    >
                      <div className="relative h-12 w-12 overflow-hidden rounded-md">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-zinc-500">
                          {item.category} · Qty {item.quantity} · $
                          {item.price.toFixed(2)} each
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        ${(item.subtotal ?? item.price * item.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>

                {order.delivery && (
                  <div className="mt-4 grid gap-3 border-t border-zinc-100 pt-4 text-sm dark:border-zinc-800 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        Delivery to
                      </p>
                      <p className="mt-1 font-medium">{order.delivery.fullName}</p>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        {order.delivery.phone}
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        {order.delivery.address}, {order.delivery.city}
                      </p>
                      {order.delivery.notes ? (
                        <p className="mt-1 text-zinc-500">
                          Notes: {order.delivery.notes}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        Payment & totals
                      </p>
                      <p className="mt-1 capitalize text-zinc-600 dark:text-zinc-400">
                        {order.paymentMethod}
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        Subtotal ${order.subtotal.toFixed(2)}
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        Delivery ${order.deliveryFee.toFixed(2)}
                      </p>
                      <p className="font-medium">
                        Total ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
