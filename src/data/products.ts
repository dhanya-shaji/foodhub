export type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
};

export const MENU_CATEGORIES = [
  "Pizza",
  "Burgers",
  "Sushi",
  "Desserts",
] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number];

/** Initial catalog used to seed MongoDB when the products collection is empty. */
export const SEED_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 8.99,
    imageUrl:
      "https://images.unsplash.com/photo-1548365328-9f547fb0953c?q=80&w=1200&auto=format&fit=crop",
    category: "Pizza",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    price: 10.49,
    imageUrl:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1200&auto=format&fit=crop",
    category: "Pizza",
  },
  {
    id: 3,
    name: "BBQ Chicken Pizza",
    price: 11.99,
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop",
    category: "Pizza",
  },
  {
    id: 4,
    name: "Cheeseburger",
    price: 7.49,
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 5,
    name: "Bacon Burger",
    price: 8.99,
    imageUrl:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 6,
    name: "Veggie Burger",
    price: 7.99,
    imageUrl:
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 7,
    name: "Sushi Platter",
    price: 14.99,
    imageUrl:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 8,
    name: "Salmon Nigiri",
    price: 12.49,
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 9,
    name: "Dragon Roll",
    price: 13.99,
    imageUrl:
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 10,
    name: "Chocolate Cake",
    price: 4.99,
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
  {
    id: 11,
    name: "Cheesecake",
    price: 5.49,
    imageUrl:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
  {
    id: 12,
    name: "Ice Cream Sundae",
    price: 4.49,
    imageUrl:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
];

export function countByCategory(category: string): number {
  return SEED_PRODUCTS.filter((product) => product.category === category)
    .length;
}
