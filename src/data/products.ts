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
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
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
    name: "Four Cheese Pizza",
    price: 11.49,
    imageUrl:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1200&auto=format&fit=crop",
    category: "Pizza",
  },
  {
    id: 5,
    name: "Vegetable Pizza",
    price: 9.99,
    imageUrl:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?q=80&w=1200&auto=format&fit=crop",
    category: "Pizza",
  },
  {
    id: 6,
    name: "Hawaiian Pizza",
    price: 10.99,
    imageUrl:
      "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?q=80&w=1200&auto=format&fit=crop",
    category: "Pizza",
  },
  {
    id: 7,
    name: "Chicken Tikka Pizza",
    price: 12.49,
    imageUrl:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1200&auto=format&fit=crop",
    category: "Pizza",
  },
  {
    id: 8,
    name: "Spicy Jalapeño Pizza",
    price: 10.99,
    imageUrl:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?q=80&w=1200&auto=format&fit=crop",
    category: "Pizza",
  },
  {
    id: 9,
    name: "Mushroom Truffle Pizza",
    price: 13.49,
    imageUrl:
      "https://images.unsplash.com/photo-1593560708920-61dd98c8c9c4?q=80&w=1200&auto=format&fit=crop",
    category: "Pizza",
  },
  {
    id: 10,
    name: "Meat Lovers Pizza",
    price: 13.99,
    imageUrl:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=1200&auto=format&fit=crop",
    category: "Pizza",
  },
  {
    id: 11,
    name: "Buffalo Chicken Pizza",
    price: 12.49,
    imageUrl:
      "https://images.unsplash.com/photo-1598023696416-0193a0bcd302?q=80&w=1200&auto=format&fit=crop",
    category: "Pizza",
  },
  {
    id: 12,
    name: "Prosciutto Arugula Pizza",
    price: 13.99,
    imageUrl:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1200&auto=format&fit=crop",
    category: "Pizza",
  },
  {
    id: 13,
    name: "Spicy Salami Pizza",
    price: 11.99,
    imageUrl:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=1200&auto=format&fit=crop",
    category: "Pizza",
  },
  {
    id: 14,
    name: "Pesto Chicken Pizza",
    price: 12.99,
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop",
    category: "Pizza",
  },
  {
    id: 15,
    name: "Mediterranean Pizza",
    price: 11.49,
    imageUrl:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?q=80&w=1200&auto=format&fit=crop",
    category: "Pizza",
  },

  // ==================== BURGERS ====================

  {
    id: 16,
    name: "Classic Cheeseburger",
    price: 7.49,
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 17,
    name: "Bacon Cheeseburger",
    price: 8.99,
    imageUrl:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 18,
    name: "Double Beef Burger",
    price: 10.99,
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 19,
    name: "Crispy Chicken Burger",
    price: 8.49,
    imageUrl:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 20,
    name: "BBQ Bacon Burger",
    price: 9.99,
    imageUrl:
      "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 21,
    name: "Mushroom Swiss Burger",
    price: 9.49,
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 22,
    name: "Spicy Chicken Burger",
    price: 8.99,
    imageUrl:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 23,
    name: "Avocado Burger",
    price: 10.49,
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 24,
    name: "Jalapeño Beef Burger",
    price: 9.49,
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 25,
    name: "Classic Chicken Burger",
    price: 7.99,
    imageUrl:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 26,
    name: "Truffle Burger",
    price: 12.99,
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 27,
    name: "Crispy Bacon Burger",
    price: 9.49,
    imageUrl:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 28,
    name: "Blue Cheese Burger",
    price: 10.49,
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 29,
    name: "Veggie Burger",
    price: 7.99,
    imageUrl:
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },
  {
    id: 30,
    name: "Double Bacon Burger",
    price: 11.49,
    imageUrl:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1200&auto=format&fit=crop",
    category: "Burgers",
  },

  // ==================== SUSHI ====================

  {
    id: 31,
    name: "Sushi Platter",
    price: 14.99,
    imageUrl:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 32,
    name: "Salmon Nigiri",
    price: 12.49,
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 33,
    name: "California Roll",
    price: 9.99,
    imageUrl:
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 34,
    name: "Dragon Roll",
    price: 13.99,
    imageUrl:
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 35,
    name: "Spicy Tuna Roll",
    price: 11.49,
    imageUrl:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 36,
    name: "Philadelphia Roll",
    price: 10.99,
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 37,
    name: "Salmon Avocado Roll",
    price: 11.99,
    imageUrl:
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 38,
    name: "Tuna Nigiri",
    price: 12.99,
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 39,
    name: "Ebi Nigiri",
    price: 10.49,
    imageUrl:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 40,
    name: "Tempura Roll",
    price: 12.49,
    imageUrl:
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 41,
    name: "Rainbow Roll",
    price: 13.49,
    imageUrl:
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 42,
    name: "Salmon Sashimi",
    price: 14.49,
    imageUrl:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 43,
    name: "Tuna Sashimi",
    price: 15.49,
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 44,
    name: "Volcano Roll",
    price: 13.99,
    imageUrl:
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },
  {
    id: 45,
    name: "Deluxe Sushi Box",
    price: 19.99,
    imageUrl:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop",
    category: "Sushi",
  },

  // ==================== DESSERTS ====================

  {
    id: 46,
    name: "Chocolate Cake",
    price: 4.99,
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
  {
    id: 47,
    name: "New York Cheesecake",
    price: 5.49,
    imageUrl:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
  {
    id: 48,
    name: "Tiramisu",
    price: 5.99,
    imageUrl:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
  {
    id: 49,
    name: "Chocolate Brownie",
    price: 4.49,
    imageUrl:
      "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
  {
    id: 50,
    name: "Ice Cream Sundae",
    price: 4.49,
    imageUrl:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
  {
    id: 51,
    name: "Strawberry Cheesecake",
    price: 5.99,
    imageUrl:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
  {
    id: 52,
    name: "Chocolate Mousse",
    price: 4.99,
    imageUrl:
      "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
  {
    id: 53,
    name: "Apple Pie",
    price: 4.49,
    imageUrl:
      "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
  {
    id: 54,
    name: "Chocolate Lava Cake",
    price: 6.49,
    imageUrl:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476f?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
  {
    id: 55,
    name: "Carrot Cake",
    price: 5.49,
    imageUrl:
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
  {
    id: 56,
    name: "Panna Cotta",
    price: 5.99,
    imageUrl:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
  {
    id: 57,
    name: "Churros with Chocolate",
    price: 5.49,
    imageUrl:
      "https://images.unsplash.com/photo-1624371414361-e670edf4898f?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
  {
    id: 58,
    name: "Strawberry Ice Cream",
    price: 3.99,
    imageUrl:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
  {
    id: 59,
    name: "Vanilla Ice Cream",
    price: 3.99,
    imageUrl:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
  {
    id: 60,
    name: "Lotus Biscoff Cheesecake",
    price: 6.49,
    imageUrl:
      "https://images.unsplash.com/photo-1578775887804-699de7086ff9?q=80&w=1200&auto=format&fit=crop",
    category: "Desserts",
  },
];

export function countByCategory(category: string): number {
  return SEED_PRODUCTS.filter((product) => product.category === category)
    .length;
}
