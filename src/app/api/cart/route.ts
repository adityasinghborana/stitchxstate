import { NextRequest, NextResponse } from "next/server";
import { CartUsecases } from "@/core/usecases/Cart.usecases";
import { CartRepository } from "@/core/repositories/ICartRepository";
import { validateAuth } from "../middleware/validAuth";

const cartUsecases = new CartUsecases(new CartRepository());

export async function GET(req: NextRequest) {
  const authResponse = await validateAuth(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const userId = authResponse.userId;
  try {
    const cart = await cartUsecases.getCart(userId);
    return NextResponse.json(cart, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const authResponse = await validateAuth(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const userId = authResponse.userId;
  try {
    const cart = await cartUsecases.getOrCreateCart(userId);
    return NextResponse.json(cart, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const authResponse = await validateAuth(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const userId = authResponse.userId;
  try {
    const cart = await cartUsecases.clearCart(userId);
    return NextResponse.json(cart, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}