import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Order, type IOrder } from "@/models/Order";
import { getProductById } from "@/lib/products";

const DELIVERY_FEE = 2.5;

function serializeOrder(order: IOrder | (IOrder & { _id: mongoose.Types.ObjectId })) {
  return {
    id: String(order._id),
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    items: order.items,
    itemCount: order.itemCount,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    status: order.status,
    delivery: order.delivery,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const orders = await Order.find({ userId: session.userId })
    .sort({ createdAt: -1 })
    .lean<IOrder[]>();

  return NextResponse.json({
    orders: orders.map((order) => serializeOrder(order)),
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Please sign in to place an order" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const items = body?.items as
      | { productId: number; quantity: number }[]
      | undefined;
    const delivery = body?.delivery as
      | {
          fullName?: string;
          phone?: string;
          address?: string;
          city?: string;
          notes?: string;
        }
      | undefined;
    const paymentMethod = String(body?.paymentMethod ?? "cash").toLowerCase();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Order must include at least one item" },
        { status: 400 }
      );
    }

    const fullName = String(delivery?.fullName ?? session.name).trim();
    const phone = String(delivery?.phone ?? "").trim();
    const address = String(delivery?.address ?? "").trim();
    const city = String(delivery?.city ?? "").trim();
    const notes = String(delivery?.notes ?? "").trim();

    if (!fullName || !phone || !address || !city) {
      return NextResponse.json(
        { error: "Delivery name, phone, address, and city are required" },
        { status: 400 }
      );
    }

    if (!["cash", "card", "upi"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    const orderItems = [];
    for (const item of items) {
      const product = await getProductById(Number(item.productId));
      const quantity = Number(item.quantity);
      if (!product || !Number.isFinite(quantity) || quantity < 1) {
        return NextResponse.json(
          { error: "Invalid order items" },
          { status: 400 }
        );
      }
      orderItems.push({
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl,
        subtotal: Number((product.price * quantity).toFixed(2)),
      });
    }

    const subtotal = Number(
      orderItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)
    );
    const itemCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryFee = DELIVERY_FEE;
    const total = Number((subtotal + deliveryFee).toFixed(2));

    await connectDB();

    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(session.userId),
      customerName: session.name,
      customerEmail: session.email,
      items: orderItems,
      itemCount,
      subtotal,
      deliveryFee,
      total,
      status: "pending",
      delivery: {
        fullName,
        phone,
        address,
        city,
        notes,
      },
      paymentMethod,
    });

    return NextResponse.json(
      { order: serializeOrder(order) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Unable to place order" },
      { status: 500 }
    );
  }
}
