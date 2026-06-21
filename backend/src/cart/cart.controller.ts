import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@GetUser() user: { id: string }) {
    return this.cartService.getCart(user.id);
  }

  @Post()
  addToCart(
    @GetUser() user: { id: string },
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addToCart(user.id, dto.productId, dto.quantity ?? 1);
  }

  @Patch(':id')
  updateQuantity(
    @GetUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateCartDto,
  ) {
    return this.cartService.updateQuantity(user.id, id, dto.quantity);
  }

  @Delete(':id')
  removeFromCart(
    @GetUser() user: { id: string },
    @Param('id') id: string,
  ) {
    return this.cartService.removeFromCart(user.id, id);
  }

  @Delete()
  clearCart(@GetUser() user: { id: string }) {
    return this.cartService.clearCart(user.id);
  }
}
