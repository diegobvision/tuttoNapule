import { NextRequest, NextResponse } from "next/server";
import {
  getCart,
  createCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
  isShopifyConfigured,
} from "@/lib/shopify";

// Cart is always live — never cached.
export const dynamic = "force-dynamic";

function guard() {
  if (!isShopifyConfigured) {
    return NextResponse.json(
      { error: "Shopify is not configured." },
      { status: 503 }
    );
  }
  return null;
}

export async function GET(req: NextRequest) {
  const blocked = guard();
  if (blocked) return blocked;

  const cartId = req.nextUrl.searchParams.get("cartId");
  if (!cartId) return NextResponse.json({ cart: null });

  try {
    const cart = await getCart(cartId);
    return NextResponse.json({ cart });
  } catch (err) {
    console.error("[api/cart GET]", (err as Error).message);
    // Treat as an expired/invalid cart so the client resets cleanly.
    return NextResponse.json({ cart: null });
  }
}

interface CartAction {
  action: "create" | "add" | "update" | "remove";
  cartId?: string;
  merchandiseId?: string;
  quantity?: number;
  lineId?: string;
}

export async function POST(req: NextRequest) {
  const blocked = guard();
  if (blocked) return blocked;

  let body: CartAction;
  try {
    body = (await req.json()) as CartAction;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    let cart = null;

    switch (body.action) {
      case "create":
      case "add": {
        if (!body.merchandiseId || !body.quantity) {
          return NextResponse.json({ error: "merchandiseId and quantity required." }, { status: 400 });
        }
        const line = { merchandiseId: body.merchandiseId, quantity: body.quantity };
        // Add to an existing cart if we have one, otherwise create.
        if (body.cartId) {
          cart = await addCartLines(body.cartId, [line]);
          // Cart may have expired server-side; fall back to creating a new one.
          if (!cart) cart = await createCart([line]);
        } else {
          cart = await createCart([line]);
        }
        break;
      }
      case "update": {
        if (!body.cartId || !body.lineId || body.quantity === undefined) {
          return NextResponse.json({ error: "cartId, lineId and quantity required." }, { status: 400 });
        }
        cart = await updateCartLines(body.cartId, [{ id: body.lineId, quantity: body.quantity }]);
        break;
      }
      case "remove": {
        if (!body.cartId || !body.lineId) {
          return NextResponse.json({ error: "cartId and lineId required." }, { status: 400 });
        }
        cart = await removeCartLines(body.cartId, [body.lineId]);
        break;
      }
      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }

    return NextResponse.json({ cart });
  } catch (err) {
    console.error("[api/cart POST]", (err as Error).message);
    return NextResponse.json({ error: "Cart operation failed." }, { status: 500 });
  }
}
