"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const carouselImages = [
  {
    src: "https://images.unsplash.com/photo-1548365328-9f547fb0953c?q=80&w=1200&auto=format&fit=crop",
    alt: "Delicious Pizza",
    title: "Fresh Pizza",
    description: "Handcrafted with love and premium ingredients"
  },
  {
    src: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
    alt: "Gourmet Burger",
    title: "Gourmet Burgers",
    description: "Juicy patties with fresh vegetables and artisan buns"
  },
  {
    src: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop",
    alt: "Fresh Sushi",
    title: "Fresh Sushi",
    description: "Authentic Japanese cuisine made with the finest fish"
  }
];

const menuCategories = [
  {
    name: "Pizza",
    image: "https://images.unsplash.com/photo-1548365328-9f547fb0953c?q=80&w=400&auto=format&fit=crop",
    count: 12
  },
  {
    name: "Burgers",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop",
    count: 8
  },
  {
    name: "Sushi",
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=400&auto=format&fit=crop",
    count: 15
  },
  {
    name: "Desserts",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop",
    count: 6
  }
];

const popularItems = [
  {
    name: "Margherita Pizza",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1548365328-9f547fb0953c?q=80&w=300&auto=format&fit=crop",
    rating: 4.8
  },
  {
    name: "Classic Cheeseburger",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=300&auto=format&fit=crop",
    rating: 4.6
  },
  {
    name: "Salmon Sushi Roll",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=300&auto=format&fit=crop",
    rating: 4.9
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="relative h-full">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white max-w-2xl px-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {image.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-8">
                    {image.description}
                  </p>
                  <Link
                    href="/product"
                    className="inline-block rounded-lg bg-white px-8 py-3 text-lg font-semibold text-black transition hover:bg-gray-100"
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Menu Categories */}
      <section className="py-16 bg-gray-50 dark:bg-zinc-900">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Menu Categories</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover our wide variety of delicious dishes
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {menuCategories.map((category, index) => (
              <Link
                key={index}
                href="/product"
                className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-lg dark:bg-zinc-800"
              >
                <div className="aspect-square">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm">{category.count} items</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Items</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Customer favorites you&apos;ll love
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {popularItems.map((item, index) => (
              <div
                key={index}
                className="group rounded-xl overflow-hidden bg-white shadow-sm transition hover:shadow-lg dark:bg-zinc-800"
              >
                <div className="aspect-video relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm">{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-green-600">${item.price}</p>
                  <button className="mt-4 w-full rounded-lg bg-black py-2 text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-lg mb-8 text-gray-300">
            Browse our full menu and place your order for delivery or pickup
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/product"
              className="rounded-lg bg-white px-8 py-3 text-lg font-semibold text-black transition hover:bg-gray-100"
            >
              View Full Menu
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white px-8 py-3 text-lg font-semibold transition hover:bg-white hover:text-black"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
