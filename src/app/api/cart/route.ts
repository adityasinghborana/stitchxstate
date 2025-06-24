// api/routes/cart.route.ts
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CartUsecases } from "@/core/usecases/Cart.usecases";
import { CartRepository } from "@/core/repositories/ICartRepository";
import { AddToCartDTO, UpdateCartItemDTO, RemoveFromCartDTO } from "@/core/dtos/Cart.dto";

const router = express.Router();
const cartUsecases = new CartUsecases(new CartRepository());

// Validate request body for DTOs
const validateDTO = (dtoType: "AddToCartDTO" | "UpdateCartItemDTO" | "RemoveFromCartDTO" | null) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = req.body;
    if (!dto && dtoType !== null) {
      res.status(400).json({ error: "Request body is required" });
      return;
    }
    if (dtoType === "AddToCartDTO") {
      if (!dto.productVariationId || typeof dto.quantity !== "number" || dto.quantity <= 0) {
        res.status(400).json({ error: "Invalid productVariationId or quantity" });
        return;
      }
    } else if (dtoType === "UpdateCartItemDTO") {
      if (!dto.cartItemId || typeof dto.quantity !== "number") {
        res.status(400).json({ error: "Invalid cartItemId or quantity" });
        return;
      }
    } else if (dtoType === "RemoveFromCartDTO") {
      if (!dto.cartItemId) {
        res.status(400).json({ error: "Invalid cartItemId" });
        return;
      }
    }
    next();
  };
};

// Validate userId and token
const validateAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.headers["x-user-id"] as string;
  const authHeader = req.headers.authorization;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized: User ID is required" });
    return;
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secure-jwt-secret") as {
      id: string;
    };
    if (decoded.id !== userId) {
      res.status(401).json({ error: "Unauthorized: User ID does not match token" });
      return;
    }
    req.user = { id: userId };
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    return;
  }
};

// GET /cart - Get user's active cart
router.get("/cart", validateAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const cart = await cartUsecases.getCart(userId);
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST /cart - Get or create user's cart
router.post("/cart", validateAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const cart = await cartUsecases.getOrCreateCart(userId);
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST /cart/add - Add item to cart
router.post("/cart/add", validateAuth, validateDTO("AddToCartDTO"), async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const dto: AddToCartDTO = req.body;
    const cart = await cartUsecases.addToCart(dto, userId);
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /cart/item - Update cart item quantity
router.put("/cart/item", validateAuth, validateDTO("UpdateCartItemDTO"), async (req: Request, res: Response) => {
  try {
    const dto: UpdateCartItemDTO = req.body;
    const cart = await cartUsecases.updateCartItem(dto);
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /cart/item - Remove item from cart
router.delete("/cart/item", validateAuth, validateDTO("RemoveFromCartDTO"), async (req: Request, res: Response) => {
  try {
    const dto: RemoveFromCartDTO = req.body;
    const cart = await cartUsecases.removeCartItem(dto);
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /cart - Clear cart
router.delete("/cart", validateAuth, validateDTO(null), async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const cart = await cartUsecases.clearCart(userId);
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;