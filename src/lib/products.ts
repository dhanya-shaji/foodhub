import { SEED_PRODUCTS, type Product } from "@/data/products";
import { connectDB } from "@/lib/mongodb";
import { Product as ProductModel, type IProduct } from "@/models/Product";

export function serializeProduct(product: IProduct): Product {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    category: product.category,
  };
}

/** Inserts seed catalog once when the products collection is empty. */
export async function ensureProductsSeeded() {
  await connectDB();
  const count = await ProductModel.countDocuments();
  if (count === 0) {
    await ProductModel.insertMany(SEED_PRODUCTS);
    return { seeded: true, count: SEED_PRODUCTS.length };
  }

  // Keep existing seeded docs aligned with the catalog (categories, names, etc.)
  await Promise.all(
    SEED_PRODUCTS.map((product) =>
      ProductModel.updateOne(
        { id: product.id },
        { $set: product },
        { upsert: true }
      )
    )
  );

  return { seeded: false, count };
}

export async function getAllProducts(): Promise<Product[]> {
  await ensureProductsSeeded();
  const products = await ProductModel.find().sort({ id: 1 }).lean<IProduct[]>();
  return products.map(serializeProduct);
}

export async function getProductById(id: number): Promise<Product | null> {
  await ensureProductsSeeded();
  const product = await ProductModel.findOne({ id }).lean<IProduct | null>();
  return product ? serializeProduct(product) : null;
}
