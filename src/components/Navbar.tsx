"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/product", label: "Menu" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { cartCount, wishlist } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    router.push("/");
    router.refresh();
  }

  const linkClass = (href: string) =>
    `text-sm font-medium transition ${
      pathname === href
        ? "text-zinc-900 dark:text-white"
        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
    }`;

  const mobileLinkClass = (href: string) =>
    `block rounded-lg px-3 py-2.5 text-base font-medium transition ${
      pathname === href
        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
        : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-black dark:bg-white" />
            <span className="text-xl font-bold">FoodHub</span>
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={linkClass(href)}>
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/wishlist"
              className="relative rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              aria-label="Wishlist"
            >
              Wishlist
              {wishlist.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white dark:bg-white dark:text-black">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              aria-label="Cart"
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white dark:bg-white dark:text-black">
                  {cartCount}
                </span>
              )}
            </Link>

            {!loading && user ? (
              <>
                <Link
                  href="/profile"
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  {user.name.split(" ")[0]}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/product"
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Order Now
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-300 text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white dark:bg-white dark:text-black">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-300 text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-full z-50 border-b border-zinc-200 bg-white px-4 py-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={mobileLinkClass(href)}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <Link
                href="/wishlist"
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                onClick={() => setMenuOpen(false)}
              >
                Wishlist
                {wishlist.length > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[10px] font-semibold text-white dark:bg-white dark:text-black">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {!loading && user ? (
                <>
                  <Link
                    href="/profile"
                    className={mobileLinkClass("/profile")}
                    onClick={() => setMenuOpen(false)}
                  >
                    {user.name.split(" ")[0]}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block rounded-lg border border-zinc-300 px-4 py-2.5 text-center text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/product"
                    className="block rounded-lg bg-black px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Order Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
      <path d="M3 3h2l2.4 12.3a2 2 0 0 0 2 1.7h7.4a2 2 0 0 0 2-1.6L21 8H6" />
    </svg>
  );
}
