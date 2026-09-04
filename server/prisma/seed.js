const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const products = [
  {
    name: 'iPhone 17 Pro',
    slug: 'iphone-17-pro',
    brand: 'Apple',
    description:
      'Apple iPhone 17 Pro with advanced camera system, A19 Pro chip, and ProMotion display.',
    mrp: 149900,
    price: 134900,
    variants: [
      {
        name: 'Color',
        value: 'Silver',
        image:
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
      },
      {
        name: 'Color',
        value: 'Orange',
        image:
          'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80',
      },
      {
        name: 'Color',
        value: 'Blue',
        image:
          'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80',
      },
    ],
    emiPlans: [
      { tenure: 3, monthlyAmount: 44967, interestRate: 0, cashback: 2000 },
      { tenure: 6, monthlyAmount: 22484, interestRate: 0, cashback: 1500 },
      { tenure: 12, monthlyAmount: 11804, interestRate: 10.5, cashback: 1000 },
      { tenure: 24, monthlyAmount: 6221, interestRate: 10.5, cashback: null },
      { tenure: 36, monthlyAmount: 4390, interestRate: 10.5, cashback: null },
    ],
  },
  {
    name: 'Samsung Galaxy S25 Ultra',
    slug: 'samsung-s25-ultra',
    brand: 'Samsung',
    description:
      'Samsung Galaxy S25 Ultra with S Pen, 200MP camera, and AI-powered Galaxy features.',
    mrp: 129999,
    price: 119999,
    variants: [
      {
        name: 'Color',
        value: 'Titanium Black',
        image:
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
      },
      {
        name: 'Color',
        value: 'Titanium Gray',
        image:
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      },
      {
        name: 'Color',
        value: 'Titanium Blue',
        image:
          'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80',
      },
    ],
    emiPlans: [
      { tenure: 3, monthlyAmount: 39999, interestRate: 0, cashback: 2500 },
      { tenure: 6, monthlyAmount: 20000, interestRate: 0, cashback: 1500 },
      { tenure: 12, monthlyAmount: 10500, interestRate: 10.5, cashback: 1000 },
      { tenure: 24, monthlyAmount: 5530, interestRate: 10.5, cashback: null },
      { tenure: 36, monthlyAmount: 3905, interestRate: 10.5, cashback: null },
    ],
  },
  {
    name: 'MacBook Air',
    slug: 'macbook-air',
    brand: 'Apple',
    description:
      'Apple MacBook Air with M-series chip, Liquid Retina display, and all-day battery life.',
    mrp: 114900,
    price: 99900,
    variants: [
      {
        name: 'Color',
        value: 'Midnight',
        image:
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      },
      {
        name: 'Color',
        value: 'Silver',
        image:
          'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
      },
      {
        name: 'Color',
        value: 'Starlight',
        image:
          'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
      },
    ],
    emiPlans: [
      { tenure: 3, monthlyAmount: 33300, interestRate: 0, cashback: 3000 },
      { tenure: 6, monthlyAmount: 16650, interestRate: 0, cashback: 2000 },
      { tenure: 12, monthlyAmount: 8740, interestRate: 10.5, cashback: 1000 },
      { tenure: 24, monthlyAmount: 4605, interestRate: 10.5, cashback: null },
      { tenure: 36, monthlyAmount: 3250, interestRate: 10.5, cashback: null },
    ],
  },
];

async function main() {
  // Idempotent seed: delete related rows first, then recreate sample products by slug.
  await prisma.emiPlan.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany({
    where: {
      slug: {
        in: products.map((product) => product.slug),
      },
    },
  });

  for (const product of products) {
    const { variants, emiPlans, ...productData } = product;

    await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants,
        },
        emiPlans: {
          create: emiPlans,
        },
      },
    });
  }

  const productCount = await prisma.product.count();
  const variantCount = await prisma.variant.count();
  const emiPlanCount = await prisma.emiPlan.count();

  console.log('Seed completed successfully');
  console.log(`Products: ${productCount}`);
  console.log(`Variants: ${variantCount}`);
  console.log(`EMI plans: ${emiPlanCount}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
