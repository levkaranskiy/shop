import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
  }

  async addToCart(userId: string, productId: string, quantity: number = 1) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      });
    }

    return this.prisma.cartItem.create({
      data: { userId, productId, quantity },
      include: { product: true },
    });
  }

  async updateQuantity(userId: string, cartItemId: string, quantity: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (item.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true },
    });
  }

  async removeFromCart(userId: string, cartItemId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (item.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({ where: { userId } });
    return { message: 'Cart cleared' };
  }
}
