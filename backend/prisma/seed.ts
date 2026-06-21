import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shop.com' },
    update: {},
    create: {
      email: 'admin@shop.com',
      password: adminPassword,
      name: 'Азиз Азизов',
      role: Role.ADMIN,
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@shop.com' },
    update: {},
    create: {
      email: 'user@shop.com',
      password: userPassword,
      name: 'Али Алиев',
      role: Role.USER,
    },
  });

  // Create sample products
  const products = [
    {
      name: 'Беспроводные наушники Pro',
      description: 'Премиальные беспроводные наушники с активным шумоподавлением, 30 часов автономной работы и кристально чистым звуком.',
      price: 1350,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      category: 'Электроника',
    },
    {
      name: 'Умные часы FitMax',
      description: 'Фитнес-трекер с GPS, мониторингом сердечного ритма, сна и стресса. Водонепроницаемость до 50м.',
      price: 890,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      category: 'Электроника',
    },
    {
      name: 'Рюкзак для ноутбука',
      description: 'Стильный городской рюкзак с отделением для ноутбука до 15.6", USB-портом для зарядки и защитой от краж.',
      price: 380,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      category: 'Аксессуары',
    },
    {
      name: 'Механическая клавиатура RGB',
      description: 'Игровая механическая клавиатура с подсветкой RGB, переключателями Cherry MX и алюминиевым корпусом.',
      price: 850,
      imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
      category: 'Электроника',
    },
    {
      name: 'Кофейная кружка термо',
      description: 'Вакуумная термокружка из нержавеющей стали 450мл. Сохраняет тепло 12 часов, холод — 24 часа.',
      price: 140,
      imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=400',
      category: 'Дом и офис',
    },
    {
      name: 'Портативная колонка Bass+',
      description: 'Bluetooth колонка с мощным басом, защитой IPX7 и 20 часами воспроизведения. Идеальна для путешествий.',
      price: 520,
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
      category: 'Электроника',
    },
    {
      name: 'Настольная лампа LED',
      description: 'Светодиодная лампа с регулировкой яркости и цветовой температуры. Беспроводная зарядка в основании.',
      price: 320,
      imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400',
      category: 'Дом и офис',
    },
    {
      name: 'Фитнес-коврик премиум',
      description: 'Нескользящий коврик для йоги из экологичного TPE материала, толщина 6мм, с разметкой для выравнивания.',
      price: 260,
      imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
      category: 'Спорт',
    },
    {
      name: 'Кожаный чехол для телефона',
      description: 'Ручная работа из натуральной кожи, совместим с iPhone 15/16, MagSafe, карманы для карт.',
      price: 210,
      imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
      category: 'Аксессуары',
    },
    {
      name: 'Гантели разборные 20кг',
      description: 'Набор разборных гантелей общим весом 20кг. Хромированные блины, прорезиненные грифы.',
      price: 630,
      imageUrl: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400',
      category: 'Спорт',
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('Seed completed:');
  console.log(`  Admin: admin@shop.com / admin123`);
  console.log(`  User:  user@shop.com / user123`);
  console.log(`  Products: ${products.length} created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
